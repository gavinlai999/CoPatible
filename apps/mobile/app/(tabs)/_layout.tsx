import { Tabs } from 'expo-router';
import React from 'react';
import { Home, Mic, Users, User } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Platform } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface || '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: theme.border,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        }
      }}>
      <Tabs.Screen
        name="journey/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="live/index"
        options={{
          title: 'Circles',
          tabBarIcon: ({ color, size }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={24} color={color} />,
        }}
      />
      {/* Hide index which is just a redirect usually */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      {/* Hide voice tab globally if it exists, as checkin is triggered from home */}
      <Tabs.Screen
        name="voice"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

