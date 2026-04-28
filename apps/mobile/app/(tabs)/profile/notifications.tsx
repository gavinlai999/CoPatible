import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity, Platform } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export default function NotificationsScreen() {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.webContainer}>
          <View style={styles.content}>
            <View style={styles.settingRow}>
                <View style={styles.textContainer}>
                    <Text style={styles.settingLabel}>Push Notifications</Text>
                    <Text style={styles.settingSub}>Keep track of your circles in real time.</Text>
                </View>
                <Switch 
                    value={pushEnabled} 
                    onValueChange={setPushEnabled}
                    trackColor={{ false: '#eee', true: colors.primary }}
                />
            </View>
            <View style={styles.settingRow}>
                <View style={styles.textContainer}>
                    <Text style={styles.settingLabel}>Email Summaries</Text>
                    <Text style={styles.settingSub}>Get weekly summaries of your matches.</Text>
                </View>
                <Switch 
                    value={emailEnabled} 
                    onValueChange={setEmailEnabled}
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
