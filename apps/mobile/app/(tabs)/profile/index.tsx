import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Switch, Linking } from 'react-native';
import { MapPin, Shield, Bell, CircleHelp, LogOut, ChevronRight, Settings, Edit, Instagram, Linkedin, Youtube, Ghost } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useRouter, useFocusEffect } from 'expo-router';
import { typography } from '@/constants/typography';
import { supabase } from '../../../supabase';

const MOCK_USER = {
  name: "Mike Thorne",
  location: "San Francisco",
  bio: "Software Engineer at Stripe. Loves deep house, bouldering, and finding the best espresso in SF. ☕️",
  avatar: "https://i.pravatar.cc/150?u=mike",
  stats: [
    { label: "3 Circles" },
    { label: "11 People" },
    { label: "4 Streak" },
  ],
  peopleMet: [
    { id: '1', avatar: 'https://i.pravatar.cc/150?u=12' },
    { id: '2', avatar: 'https://i.pravatar.cc/150?u=33' },
    { id: '3', avatar: 'https://i.pravatar.cc/150?u=44' },
    { id: '4', avatar: 'https://i.pravatar.cc/150?u=55' },
    { id: '5', avatar: 'https://i.pravatar.cc/150?u=66' },
    { id: '6', avatar: 'https://i.pravatar.cc/150?u=77' },
  ],
  vibe: "Calm",
  energy: "Intimate",
  traits: ["Deep Conversations", "Analytical", "Reflective"],
};

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(MOCK_USER);

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', authData.user.email)
            .single();
          if (data) {
            setProfile((prev: any) => ({
              ...prev,
              name: data.full_name || prev.name,
              bio: data.bio || prev.bio,
              avatar: data.avatar_url || prev.avatar,
              instagram: data.instagram,
              linkedin: data.linkedin,
              snapchat: data.snapchat,
              youtube: data.youtube,
            }));
          }
        }
      };
      loadProfile();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <TouchableOpacity onPress={() => router.push('/(tabs)/profile/edit')}>
                  <Edit size={22} color={colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity>
                  <Settings size={22} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
        </View>

        {/* Profile Card */}
        <View style={styles.profileHeader}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            <View style={styles.identity}>
                <Text style={styles.userName}>{profile.name}</Text>
                <View style={styles.locationRow}>
                    <MapPin size={12} color={colors.text.secondary} />
                    <Text style={styles.locationText}>{profile.location}</Text>
                </View>
            </View>
        </View>

        {/* Stats */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
            {MOCK_USER.stats.map((stat, i) => (
                <View key={i} style={styles.statPill}>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
            ))}
        </ScrollView>

        {/* People You've Met */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>PEOPLE YOU'VE MET</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.peopleScroll}>
            {MOCK_USER.peopleMet.map(p => (
               <Image key={p.id} source={{ uri: p.avatar }} style={styles.metAvatar} />
            ))}
            <TouchableOpacity style={styles.morePeopleBtn}>
                <ChevronRight size={20} color={colors.text.secondary} />
            </TouchableOpacity>
        </ScrollView>

        {/* What Co Knows About You */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>WHAT CO KNOWS ABOUT YOU</Text>
        </View>
        
        <View style={styles.coInsightsBox}>
            <Text style={styles.bioText}>"{profile.bio}"</Text>

            {(profile.instagram || profile.linkedin || profile.snapchat || profile.youtube) && (
              <View style={styles.socialsContainer}>
                {profile.instagram ? (
                  <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL(`https://instagram.com/${profile.instagram.replace('@','')}`)}>
                    <Instagram size={20} color="#E1306C" />
                  </TouchableOpacity>
                ) : null}
                {profile.linkedin ? (
                  <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL(profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`)}>
                    <Linkedin size={20} color="#0077b5" />
                  </TouchableOpacity>
                ) : null}
                {profile.snapchat ? (
                  <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL(`https://snapchat.com/add/${profile.snapchat}`)}>
                    <Ghost size={20} color="#E1CC00" />
                  </TouchableOpacity>
                ) : null}
                {profile.youtube ? (
                  <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL(profile.youtube.startsWith('http') ? profile.youtube : `https://${profile.youtube}`)}>
                    <Youtube size={20} color="#FF0000" />
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
            
            <View style={styles.pillsContainer}>
                <View style={[styles.traitPill, { backgroundColor: '#FDF1EE' }]}>
                    <Text style={[styles.traitText, { color: colors.primary }]}>Vibe: {profile.vibe}</Text>
                </View>
                <View style={[styles.traitPill, { backgroundColor: '#E8F5E9' }]}>
                    <Text style={[styles.traitText, { color: '#2E7D32' }]}>Energy: {profile.energy}</Text>
                </View>
                {profile.traits.map((t: string, i: number) => (
                    <View key={i} style={styles.traitPill}>
                        <Text style={styles.traitText}>{t}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Settings Section */}
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { marginTop: 24 }]}>SETTINGS</Text>
        </View>
        
        <View style={styles.settingsBlock}>
            <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsLeft}>
                    <View style={[styles.iconBox, { backgroundColor: '#F0EBE5' }]}>
                        <Shield size={18} color={colors.text.primary} />
                    </View>
                    <Text style={styles.settingsLabel}>Account Settings</Text>
                </View>
                <ChevronRight size={18} color={colors.text.secondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsItem} onPress={() => router.push('/(tabs)/profile/notifications')}>
                <View style={styles.settingsLeft}>
                    <View style={[styles.iconBox, { backgroundColor: '#FDF1EE' }]}>
                        <Bell size={18} color={colors.primary} />
                    </View>
                    <Text style={styles.settingsLabel}>Notifications</Text>
                </View>
                <ChevronRight size={18} color={colors.text.secondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsItem} onPress={() => router.push('/(tabs)/profile/privacy')}>
                <View style={styles.settingsLeft}>
                    <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                        <Shield size={18} color="#2E7D32" />
                    </View>
                    <Text style={styles.settingsLabel}>Privacy</Text>
                </View>
                <ChevronRight size={18} color={colors.text.secondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsItem} onPress={() => Linking.openURL('https://copatible.com')}>
                <View style={styles.settingsLeft}>
                    <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                        <CircleHelp size={18} color="#1976D2" />
                    </View>
                    <Text style={styles.settingsLabel}>Help & Support</Text>
                </View>
                <ChevronRight size={18} color={colors.text.secondary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingsItem, { borderBottomWidth: 0 }]}>
                <View style={styles.settingsLeft}>
                    <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                        <LogOut size={18} color="#D32F2F" />
                    </View>
                    <Text style={[styles.settingsLabel, { color: '#D32F2F' }]}>Log Out</Text>
                </View>
            </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  contentContainer: { paddingHorizontal: 20, paddingTop: 10 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: { ...typography.h1, fontSize: 32, color: colors.text.primary, letterSpacing: -1 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#eee' },
  identity: { gap: 4 },
  userName: { ...typography.h2, color: colors.text.primary, fontSize: 24 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { ...typography.bodySmall, color: colors.text.secondary },
  
  statsScroll: { marginBottom: 32 },
  statPill: { 
    backgroundColor: '#F7F4EF', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 20, 
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF'
  },
  statLabel: { ...typography.bodyBold, fontSize: 13, color: colors.text.primary },
  
  sectionHeader: { marginBottom: 16 },
  sectionLabel: { ...typography.label, color: colors.text.secondary, fontSize: 11 },
  
  peopleScroll: { flexDirection: 'row', marginBottom: 32 },
  metAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: -12, borderWidth: 3, borderColor: colors.background, backgroundColor: '#eee' },
  morePeopleBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0EBE5', alignItems: 'center', justifyContent: 'center', marginLeft: 16, borderWidth: 3, borderColor: colors.background },
  
  coInsightsBox: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  bioText: { ...typography.body, color: colors.text.primary, lineHeight: 24, fontStyle: 'italic', marginBottom: 20 },
  
  pillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  traitPill: { backgroundColor: '#F0EBE5', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  traitText: { ...typography.bodyBold, fontSize: 13, color: colors.text.secondary },
  
  settingsBlock: {
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE5',
  },
  settingsLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  settingsLabel: { ...typography.bodyBold, color: colors.text.primary, fontSize: 15 },
  socialsContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  socialBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F7F4EF', alignItems: 'center', justifyContent: 'center' },
});


