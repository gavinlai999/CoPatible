import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView, TextInput, Platform } from 'react-native';
import { Mic, ArrowRight, X, Flame, MessageSquare, PartyPopper, Leaf, AudioLines, Check } from 'lucide-react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

const CONNECTION_OPTIONS = [
  { id: 'loose', label: 'Need to Let Loose', icon: Flame, color: '#FF5C00' },
  { id: 'deep', label: 'Want Deep Conversation', icon: MessageSquare, color: '#4A60E4' },
  { id: 'celebrate', label: 'Ready to Celebrate', icon: PartyPopper, color: '#FFD600' },
  { id: 'low', label: 'Something Low Pressure', icon: Leaf, color: '#34C759' },
];

export default function VoiceScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'needs' | 'voice' | 'transcript'>('needs');
  const [selectedNeed, setSelectedNeed] = useState<string | null>(null);
  
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const SpeechRecognitionLocal = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionLocal) {
        const rec = new SpeechRecognitionLocal();
        rec.continuous = true;
        rec.interimResults = true;
        rec.onresult = (event: any) => {
          let text = '';
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          setTranscriptText(text);
        };
        setRecognition(rec);
      }
    }
  }, []);

  const handleNextStep = (id: string) => {
    setSelectedNeed(id);
    setStep('voice');
  };

  const startRecording = async () => {
    setTranscriptText(""); // Reset transcript
    try {
      if (Platform.OS !== 'web') {
        if (permissionResponse?.status !== 'granted') {
          await requestPermission();
        }
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        setRecording(recording);
      } else if (recognition) {
        recognition.start();
      }
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (Platform.OS !== 'web' && recording) {
        await recording.stopAndUnloadAsync();
    } else if (Platform.OS === 'web' && recognition) {
        recognition.stop();
    }
    
    // Move to transcript step instead of auto-processing
    setStep('transcript');
  };

  const submitTranscript = async () => {
    setAnalyzing(true);
    try {
      let base64Audio = null;
      if (Platform.OS !== 'web' && recording) {
        const uri = recording.getURI();
        if (uri) {
           base64Audio = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
        }
      }

      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          profileId: "mike-user-id", 
          voiceAudioBase64: base64Audio, 
          need: selectedNeed, 
          transcript: transcriptText 
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend Error:", errorText);
      }
      
      router.push('/matching');
    } catch (err) {
      console.error(err);
      setTimeout(() => router.push('/matching'), 1000); // Fallback to matching screen
    } finally {
      setAnalyzing(false);
    }
  };

  if (step === 'needs') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.stepTitle}>Got it. Now &mdash;</Text>
          <Text style={styles.mainTitle}>what kind of connection do you need right now?</Text>
          
          <View style={styles.optionsGrid}>
            {CONNECTION_OPTIONS.map((opt) => (
              <TouchableOpacity 
                key={opt.id} 
                style={styles.optionCard}
                onPress={() => handleNextStep(opt.id)}
              >
                <View style={styles.optionLeft}>
                  <opt.icon size={24} color={opt.color} />
                  <Text style={styles.optionLabel}>{opt.label}</Text>
                </View>
                <ArrowRight size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === 'transcript') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep('voice')}>
            <X size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.mainTitle}>Here's what I heard:</Text>
          <TextInput
            style={styles.transcriptInput}
            value={transcriptText}
            onChangeText={setTranscriptText}
            multiline
            placeholder="Start typing your thoughts..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={submitTranscript}
            disabled={analyzing}
          >
            {analyzing ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>Find my people</Text>
                <ArrowRight size={20} color="white" />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep('needs')}>
              <X size={24} color={colors.text.primary} />
          </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.mainTitle}>Want to tell me more?</Text>
        <Text style={styles.subtitle}>
          30 seconds. Or skip and I&apos;ll match you based on what you&apos;ve shared.
        </Text>

        <View style={styles.centerSection}>
          <TouchableOpacity 
            style={[styles.recordCircle, isRecording && styles.recordingCircle]}
            onPressIn={startRecording}
            onPressOut={stopRecording}
          >
            {analyzing ? (
              <ActivityIndicator color="white" size="large" />
            ) : (
                <View style={styles.recordInner}>
                    {isRecording ? <AudioLines size={40} color="white" /> : <Mic size={40} color="white" />}
                </View>
            )}
          </TouchableOpacity>
          <Text style={styles.recordText}>
            {isRecording ? "Recording..." : (analyzing ? "Analyzing state..." : "Hold to record")}
          </Text>
        </View>

        <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => {
                setTranscriptText("I just had a really long day and I'm looking for some people to grab a coffee with and vent about work.");
                setStep('transcript'); 
            }}
        >
          <Text style={styles.skipText}>Skip voice &mdash; match me now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 10, height: 50 },
  content: { paddingHorizontal: 24, paddingTop: 20 },
  stepTitle: { ...typography.body, color: colors.text.secondary, marginBottom: 8 },
  mainTitle: { ...typography.h1, color: colors.text.primary, fontSize: 32, lineHeight: 40, marginBottom: 24 },
  subtitle: { ...typography.body, color: colors.text.secondary, lineHeight: 24, marginBottom: 40 },
  optionsGrid: { gap: 12 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  optionLabel: { ...typography.bodyBold, color: colors.text.primary },
  centerSection: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 400 },
  recordCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  recordingCircle: {
    backgroundColor: '#FF3B30',
    transform: [{ scale: 1.1 }],
  },
  recordInner: { alignItems: 'center', justifyContent: 'center' },
  recordText: { ...typography.bodyBold, color: colors.text.primary, marginTop: 24 },
  skipButton: { alignSelf: 'center', marginTop: 'auto', marginBottom: 40 },
  skipText: { ...typography.bodyBold, color: colors.primary, textDecorationLine: 'underline' },
  transcriptInput: {
    ...typography.body,
    fontSize: 20,
    lineHeight: 28,
    color: colors.text.primary,
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    minHeight: 200,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 30,
    gap: 8,
  },
  primaryButtonText: {
    ...typography.bodyBold,
    color: 'white',
    fontSize: 18,
  },
});

