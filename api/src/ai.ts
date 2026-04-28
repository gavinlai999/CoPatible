import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface VoiceAnalysis {
  emotional_state: string;
  life_chapter: string;
  social_energy: string;
}

export async function extractProfileFromVoice(transcript: string): Promise<VoiceAnalysis> {
  if (!process.env.GROQ_API_KEY) {
    console.warn("No Groq API key found. Using mock AI response.");
    return {
      emotional_state: "Overwhelmed",
      life_chapter: "New to City",
      social_energy: "Low / Seeking Grounding"
    };
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert psychotherapist and matching algorithm.
Analyze the user's voice transcript and extract 3 exact dimensions:
1. emotional_state (e.g. "Overwhelmed", "Joyful", "Lonely")
2. life_chapter (e.g. "New to City", "Post-Breakup", "Building Startup")
3. social_energy (e.g. "Low / Seeking Grounding", "High / Wanting Celebration")

Respond ONLY with a valid JSON object matching this schema. Do not include markdown formatting or extra text:
{
  "emotional_state": "...",
  "life_chapter": "...",
  "social_energy": "..."
}`
        },
        {
          role: "user",
          content: transcript,
        }
      ],
      model: "llama3-8b-8192", // Fast and capable for this extraction task
      temperature: 0,
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(responseText);
    
    return {
      emotional_state: parsed.emotional_state || "Unknown",
      life_chapter: parsed.life_chapter || "Unknown",
      social_energy: parsed.social_energy || "Unknown"
    };

  } catch (error) {
    console.error("AI Extraction Error:", error);
    return {
      emotional_state: "Overwhelmed",
      life_chapter: "New to City",
      social_energy: "Low / Seeking Grounding"
    };
  }
}
