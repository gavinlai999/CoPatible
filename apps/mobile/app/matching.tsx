import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

const MATCH_PHRASES = [
  "Finding people nearby...",
  "Locking in the right experience...",
  "Your circle is ready."
];

export default function MatchingScreen() {
  const router = useRouter();
  const [phraseIndex, setPhraseIndex] = useState(0);

  // Simple scale animation for the center "Co" bubble
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Text progression
    const textInterval = setInterval(() => {
      setPhraseIndex(prev => {
        if (prev < MATCH_PHRASES.length - 1) return prev + 1;
        clearInterval(textInterval);
        return prev;
      });
    }, 2000);

    // Final redirect
    const redirectTimeout = setTimeout(() => {
      router.replace('/(tabs)/live');
    }, 6000);

    return () => {
      clearInterval(textInterval);
      clearTimeout(redirectTimeout);
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Floating Avatars (mocked statically for layout) */}
        <View style={[styles.avatarProxy, { top: '20%', left: '15%' }]} />
        <View style={[styles.avatarProxy, { top: '15%', right: '20%' }]} />
        <View style={[styles.avatarProxy, { bottom: '30%', left: '25%' }]} />
        <View style={[styles.avatarProxy, { bottom: '25%', right: '15%' }]} />

        {/* Center Co Bubble */}
        <Animated.View style={[styles.centerBubble, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.coText}>Co</Text>
        </Animated.View>

        {/* Dynamic Text */}
        <Text style={styles.matchText}>{MATCH_PHRASES[phraseIndex]}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBubble: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  coText: {
    ...typography.h1,
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  matchText: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: 20,
  },
  avatarProxy: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.border || '#E0E0E0',
    opacity: 0.5,
  }
});
