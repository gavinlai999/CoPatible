import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ExperienceProvider } from '../contexts/ExperienceContext';
import { MatchingProvider } from '../contexts/MatchingContext';
import { MoodProvider } from '../contexts/MoodContext';
import { UserMemoryProvider } from '../contexts/UserMemoryContext';
import { supabase } from '../supabase';
import { useEffect, useState } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [session, setSession] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Auth redirection disabled for demo mode
  /*
  useEffect(() => {
    if (!initialized) return;

    const inTabsGroup = segments[0] === '(tabs)';

    if (!session && inTabsGroup) {
      // Redirect to login if not authenticated and trying to access tabs
      router.replace('/login');
    } else if (session && segments[0] === 'login') {
      // Redirect to journey if authenticated and at login
      router.replace('/(tabs)/journey');
    }
  }, [session, initialized, segments]);
  */

  return (
    <UserMemoryProvider>
      <MoodProvider>
        <MatchingProvider>
          <ExperienceProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack initialRouteName="(tabs)">
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="experience/[id]" options={{ presentation: 'modal', title: 'Experience' }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                <Stack.Screen name="onboarding" options={{ presentation: 'fullScreenModal', headerShown: false }} />
                <Stack.Screen name="host/[id]" options={{ title: 'Host Profile' }} />
                <Stack.Screen name="host-experience" options={{ title: 'Host Experience' }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </ExperienceProvider>
        </MatchingProvider>
      </MoodProvider>
    </UserMemoryProvider>
  );
}
