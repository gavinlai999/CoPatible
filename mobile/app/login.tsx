import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '../supabase';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Login failed', error.message);
    } else {
      router.replace('/(tabs)/journey');
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) {
      setLoading(false);
      Alert.alert('Sign up failed', authError.message);
      return;
    }

    if (authData.user) {
      // Create profile row manually since no trigger exists
      await supabase
        .from('profiles')
        .insert([{ email: email }]);
    }

    setLoading(false);
    if (!authError) {
      router.replace('/(tabs)/journey');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* Top Floating Mock UI Area via Positioning */}
      <View style={styles.floatingArea}>
        {/* Floating Avatars / Nodes - Simplified as visual circles for the mockup feel */}
        <View style={[styles.node, styles.nodeCo, { backgroundColor: theme.tint }]}>
          <Text style={styles.nodeCoText}>Co</Text>
        </View>
        <View style={[styles.node, styles.node1, { backgroundColor: '#EFEFEF' }]} />
        <View style={[styles.node, styles.node2, { backgroundColor: '#EFEFEF' }]} />
        <View style={[styles.node, styles.node3, { backgroundColor: '#EFEFEF' }]} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>
          Find your{'\n'}
          <Text style={[styles.titleItalic, { color: theme.tint }]}>people.</Text>
        </Text>
        
        <View style={styles.formContainer}>
          <TextInput
            style={[styles.input, { backgroundColor: '#F5F5F5', color: theme.text }]}
            placeholder="Email"
            placeholderTextColor={theme.icon}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={[styles.input, { backgroundColor: '#F5F5F5', color: theme.text }]}
            placeholder="Password"
            placeholderTextColor={theme.icon}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.primaryBtn, opacity: loading ? 0.7 : 1 }]} 
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: theme.primaryBtnText }]}>
            {loading ? 'Wait...' : 'Meet Co → (Sign Up)'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={handleLogin} disabled={loading}>
          <Text style={[styles.secondaryButtonText, { color: theme.icon }]}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  floatingArea: {
    height: 300,
    position: 'relative',
    marginTop: 40,
  },
  node: {
    position: 'absolute',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  nodeCo: { width: 80, height: 80, top: 120, left: 40 },
  nodeCoText: { color: '#FFF', fontSize: 24, fontStyle: 'italic', fontFamily: 'Georgia' }, // Mocking serif with Georgia
  node1: { width: 50, height: 50, top: 40, right: 120 },
  node2: { width: 40, height: 40, top: 100, right: 60 },
  node3: { width: 60, height: 60, top: 180, right: 40 },
  
  content: {
    paddingHorizontal: 30,
    flex: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: '500',
    lineHeight: 52,
    marginBottom: 20,
    fontFamily: 'Georgia', // Approximation of the serif font in design
  },
  titleItalic: {
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
    fontWeight: '400',
  },
  connectionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  pillAvatars: {
    position: 'absolute',
    left: 15,
    flexDirection: 'row',
  },
  tinyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  pillTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  pillSub: {
    fontSize: 10,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 10,
  },
  secondaryButtonText: {
    fontSize: 14,
  },
  formContainer: {
    marginTop: 20,
    gap: 16,
  },
  input: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
  }
});
