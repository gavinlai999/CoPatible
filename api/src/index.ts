import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { extractProfileFromVoice } from './ai.js';
import { supabase } from './supabase.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- PROFILES ---
app.post('/profiles', async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([req.body])
    .select()
    .single();
    
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

app.get('/profiles/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.params.id)
    .single();
    
  if (error || !data) return res.status(404).json({ error: 'Profile not found' });
  res.json(data);
});

// --- EXPERIENCES (Containers) ---
app.get('/experiences', async (req, res) => {
  const { data, error } = await supabase
    .from('experiences')
    .select('*');
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// --- VOICE CHECK-IN ---
app.post('/voice', async (req, res) => {
  const { profileId, voiceAudioBase64, transcript } = req.body;
  
  if (!profileId) return res.status(400).json({ error: "profileId is required" });
  
  let finalTranscript = transcript;

  // 1. Process Audio via ElevenLabs if Base64 provided but no transcript
  if (voiceAudioBase64 && !finalTranscript) {
    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(500).json({ error: "ELEVENLABS_API_KEY is not configured" });
    }
    
    try {
      // Decode the base64 string into a Buffer
      const buffer = Buffer.from(voiceAudioBase64, 'base64');

      // Create form data with the audio buffer for ElevenLabs speech-to-text v1 endpoint
      const formData = new FormData();
      const fileBlob = new Blob([buffer], { type: 'audio/mpeg' }); 
      formData.append('file', fileBlob, 'audio.mp3');
      formData.append('model_id', 'eleven_multilingual_v2');

      const elevenRes = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY
        },
        body: formData
      });

      if (!elevenRes.ok) {
         const errText = await elevenRes.text();
         throw new Error(`ElevenLabs API Error: ${errText}`);
      }

      const elevenData = await elevenRes.json();
      finalTranscript = elevenData.text;

    } catch (error) {
      console.error("ElevenLabs STT Error:", error);
      finalTranscript = "Error processing audio, fallback to default transcript.";
    }
  }

  // 2. Extract dimensions using AI (Anthropic/Claude)
  const aiExtraction = await extractProfileFromVoice(finalTranscript || "I am feeling overwhelmed and need grounding.");
  
  // 3. Save session log
  await supabase.from('voice_sessions').insert([{
    profile_id: profileId,
    transcript: finalTranscript || "Audio file provided",
    extracted_emotion: aiExtraction.emotional_state,
    extracted_chapter: aiExtraction.life_chapter,
    extracted_energy: aiExtraction.social_energy
  }]);

  // 3. Update the DB profile with the latest extracted states
  await supabase.from('profiles').update({
    current_emotional_state: aiExtraction.emotional_state,
    current_life_chapter: aiExtraction.life_chapter,
    current_social_energy: aiExtraction.social_energy,
    last_check_in: new Date().toISOString()
  }).eq('id', profileId);

  // 4. Generate a Match
  // Simple heuristic: match container_type to social_energy (e.g. Grounding)
  let query = supabase.from('experiences').select('*').limit(1);
  
  if (aiExtraction.social_energy.includes("Grounding")) {
    query = query.eq('container_type', 'Grounding');
  } else if (aiExtraction.social_energy.includes("Celebration")) {
    query = query.eq('container_type', 'Celebratory');
  }

  const { data: experiences } = await query;
  const bestFitExperience = experiences && experiences.length > 0 ? experiences[0] : null;

  if (!bestFitExperience) {
    return res.status(404).json({ error: "No experiences available to match right now.", extracted: aiExtraction });
  }

  // Handle Circle logic for the Match
  const { data: circles } = await supabase
    .from('circles')
    .select('id')
    .eq('experience_id', bestFitExperience.id)
    .eq('status', 'pending')
    .limit(1);
    
  let activeCircleId = circles?.[0]?.id;
  
  if (!activeCircleId) {
    const { data: newCircle } = await supabase.from('circles').insert([{
      experience_id: bestFitExperience.id,
      status: 'pending'
    }]).select().single();
    activeCircleId = newCircle?.id;
  }

  // Now create the Match pointing to the Circle
  const { data: finalMatch } = await supabase.from('matches').upsert([{
    profile_id: profileId,
    circle_id: activeCircleId,
    status: 'invited',
    match_reason: `This ${bestFitExperience.container_type} event matches your ${aiExtraction.emotional_state} state.`
  }], { onConflict: 'profile_id, circle_id' }).select().single();

  res.status(200).json({
    message: 'Voice processed and matching initialized',
    extracted: aiExtraction,
    new_match: finalMatch,
    experience: bestFitExperience
  });
});

// --- CIRCLES & MATCHES ---
app.get('/matches/:profileId', async (req, res) => {
  // Return matches embellished with circle and experience details
  const { data: matches, error } = await supabase
    .from('matches')
    .select(`
      *,
      circles (
        id,
        status,
        experiences (*)
      )
    `)
    .eq('profile_id', req.params.profileId);
    
  if (error) {
    if (error.code === '22P02') {
      return res.json([]);
    }
    console.error("Supabase Error in /matches/:profileId:", error);
    return res.status(500).json({ error: error.message });
  }
  res.json(matches);
});

app.patch('/matches/:id', async (req, res) => {
  const { status } = req.body; // 'confirmed' or 'declined'
  
  const { data: match, error } = await supabase
    .from('matches')
    .update({ status })
    .eq('id', req.params.id)
    .select()
    .single();
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(match);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
