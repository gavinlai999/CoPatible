import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity, Platform } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export default function PrivacyScreen() {
  const router = useRouter();
  const [profileVisible, setProfileVisible] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [voiceData, setVoiceData] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.webContainer}>
          <View style={styles.content}>
            <View style={styles.settingRow}>
                <View style={styles.textContainer}>
                    <Text style={styles.settingLabel}>Public Profile</Text>
                    <Text style={styles.settingSub}>Let others see your profile and interests.</Text>
                </View>
                <Switch 
                    value={profileVisible} 
                    onValueChange={setProfileVisible}
                    trackColor={{ false: '#eee', true: colors.primary }}
                />
            </View>
            <View style={styles.settingRow}>
                <View style={styles.textContainer}>
                    <Text style={styles.settingLabel}>Location Sharing</Text>
                    <Text style={styles.settingSub}>Use location to find events near you.</Text>
                </View>
                <Switch 
                    value={locationSharing} 
                    onValueChange={setLocationSharing}
                    trackColor={{ false: '#eee', true: colors.primary }}
                />
            </View>
            <View style={styles.settingRow}>
                <View style={styles.textContainer}>
                    <Text style={styles.settingLabel}>Store Voice Data</Text>
                    <Text style={styles.settingSub}>Allow Co to store voice clips to improve AI contextual models.</Text>
                </View>
                <Switch 
                    value={voiceData} 
                    onValueChange={setVoiceData}
                    trackColor={{ false: '#eee', true: colors.primary }}
                />
            </View>
          </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { ...typography.h3, color: colors.text.primary, fontSize: 18 },
  webContainer: { flex: 1, alignItems: Platform.OS === 'web' ? 'center' : 'stretch' },
  content: { flex: 1, width: '100%', maxWidth: 600, paddingHorizontal: 20 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0EBE5' },
  textContainer: { flex: 1, paddingRight: 16 },
  settingLabel: { ...typography.bodyBold, color: colors.text.primary, fontSize: 16 },
  settingSub: { ...typography.bodySmall, color: colors.text.secondary, marginTop: 4 },
});
