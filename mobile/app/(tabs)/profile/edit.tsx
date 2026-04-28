import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../../supabase';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export default function EditProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState('');
  
  const [form, setForm] = useState({
    full_name: '',
    bio: '',
    avatar_url: '',
    instagram: '',
    linkedin: '',
    snapchat: '',
    youtube: '',
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', authData.user.email)
          .single();
        if (data) {
          setProfileId(data.id);
          setForm({
            full_name: data.full_name || '',
            bio: data.bio || '',
            avatar_url: data.avatar_url || '',
            instagram: data.instagram || '',
            linkedin: data.linkedin || '',
            snapchat: data.snapchat || '',
            youtube: data.youtube || '',
          });
        }
      }
    };
    loadData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      // Simulating a direct data URI save for local setup convenience
      const base64Uri = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setForm({ ...form, avatar_url: base64Uri });
    }
  };

  const handleSave = async () => {
    if (!profileId) return;
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update(form)
      .eq('id', profileId);
    
    setLoading(false);
    if (error) {
      Alert.alert('Error updating profile', error.message);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text style={[styles.saveText, { opacity: loading ? 0.5 : 1 }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {form.avatar_url ? (
              <Image source={{ uri: form.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]} />
            )}
            <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
              <Camera size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={form.full_name}
            onChangeText={(txt) => setForm({ ...form, full_name: txt })}
            placeholder="Your full name"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.bio}
            onChangeText={(txt) => setForm({ ...form, bio: txt })}
            placeholder="Tell us about yourself..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SOCIAL LINKS</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Instagram (Username or URL)</Text>
          <TextInput
            style={styles.input}
            value={form.instagram}
            onChangeText={(txt) => setForm({ ...form, instagram: txt })}
            placeholder="e.g. @yourhandle"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>LinkedIn (URL)</Text>
          <TextInput
            style={styles.input}
            value={form.linkedin}
            onChangeText={(txt) => setForm({ ...form, linkedin: txt })}
            placeholder="https://linkedin.com/in/..."
            autoCapitalize="none"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Snapchat (Username)</Text>
          <TextInput
            style={styles.input}
            value={form.snapchat}
            onChangeText={(txt) => setForm({ ...form, snapchat: txt })}
            placeholder="Ghost name"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>YouTube (URL or Channel)</Text>
          <TextInput
            style={styles.input}
            value={form.youtube}
            onChangeText={(txt) => setForm({ ...form, youtube: txt })}
            placeholder="Channel link"
            autoCapitalize="none"
          />
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE5'
  },
  headerTitle: { ...typography.h2, fontSize: 18 },
  saveText: { ...typography.bodyBold, color: colors.primary, fontSize: 16 },
  container: { flex: 1 },
  content: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: { backgroundColor: '#EFEFEF' },
  cameraBtn: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    backgroundColor: colors.primary, 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white'
  },
  section: { marginBottom: 20 },
  label: { ...typography.bodyBold, fontSize: 13, color: colors.text.secondary, marginBottom: 8 },
  input: {
    backgroundColor: '#F7F4EF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...typography.body,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  sectionHeader: { marginBottom: 16, marginTop: 10 },
  sectionTitle: { ...typography.label, color: colors.text.secondary, fontSize: 11 },
});
