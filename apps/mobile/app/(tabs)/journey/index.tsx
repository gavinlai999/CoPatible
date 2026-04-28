import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Mic, MapPin, MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '../../../supabase';

const HappeningNowData = [
  { id: '1', name: 'Alex', activity: 'Bouldering', image: 'https://i.pravatar.cc/150?u=alex', emoji: '🧗' },
  { id: '2', name: 'Nadia', activity: 'Coffee crawl', image: 'https://i.pravatar.cc/150?u=nadia', emoji: '☕️' },
  { id: '3', name: 'Devon', activity: 'Painting', image: 'https://i.pravatar.cc/150?u=devon', emoji: '🎨' },
  { id: '4', name: 'Sam', activity: 'Trail run', image: 'https://i.pravatar.cc/150?u=sam', emoji: '🏃' },
];

export default function JourneyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [experiences, setExperiences] = useState<any[]>([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      const { data } = await supabase.from('experiences').select('*').order('created_at', { ascending: false });
      if (data) {
        setExperiences(data);
      }
    };
    fetchExperiences();
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={[styles.dateText, { color: theme.icon }]}>Friday, March 27 · San Francisco</Text>
        
        <View style={styles.headerRow}>
          <Text style={[styles.greeting, { color: theme.text }]}>
            Good morning,{'\n'}
            <Text style={[styles.greetingName, { color: theme.tint }]}>Mike.</Text>
          </Text>
          <Image source={{ uri: 'https://i.pravatar.cc/150?u=mike' }} style={styles.profileImage} />
        </View>

        {/* Chapter Tag */}
        <View style={styles.chapterTag}>
          <View style={[styles.dot, { backgroundColor: theme.tint }]} />
          <Text style={[styles.chapterText, { color: theme.tint }]}>Chapter: New to the city</Text>
        </View>

        {/* Talk to Co Card */}
        <View style={[styles.card, styles.coCard]}>
          <View style={styles.coCardHeader}>
            <View style={[styles.coAvatar, { backgroundColor: theme.tint }]}>
              <Text style={styles.coAvatarText}>Co</Text>
            </View>
            <View style={styles.coCardTexts}>
              <Text style={[styles.coTitle, { color: '#1A1A1A' }]}>Talk to Co</Text>
              <Text style={[styles.coSubtitle, { color: '#4A4A4A' }]}>Tell her what's going on — she'll handle the rest</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.primaryBtn, { backgroundColor: theme.tint }]}
            onPress={() => router.push('/voice')}
          >
            <Mic size={18} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>Start voice check-in</Text>
          </TouchableOpacity>
        </View>

        {/* Confirmed Section */}
        <View style={styles.sectionHeader}>
          <View style={[styles.dot, { backgroundColor: '#7A9A75' }]} />
          <Text style={styles.sectionTitle}>UPCOMING EXPERIENCES</Text>
        </View>

        {experiences.length > 0 ? experiences.map((exp, index) => (
          <TouchableOpacity 
            key={exp.id || index}
            style={[styles.card, styles.eventCard]}
            onPress={() => router.push(`/experience/${exp.id}`)}
          >
            <View style={styles.eventMap}>
              {/* Map Placeholder */}
              <View style={[styles.mapPlaceholder, { backgroundColor: '#DADBCC' }]}>
                <View style={styles.mapPin}>
                  <MapPin size={12} color="#D96C5B" />
                  <Text style={styles.mapPinText}>{exp.location}</Text>
                </View>
                <View style={styles.timeTag}>
                  <Text style={styles.timeTagText}>
                    {new Date(exp.time).toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.eventDetails}>
              <View style={styles.eventTitleRow}>
                <Text style={[styles.eventTitle, { color: '#1A1A1A' }]}>{exp.title}</Text>
                <TouchableOpacity style={styles.chatBtn}>
                  <Text style={[styles.chatBtnText, { color: theme.tint }]}>Chat →</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.eventSub, { color: '#4A4A4A' }]}>Capacity: {exp.capacity} · {exp.container_type}</Text>
              
              <View style={styles.eventAttendees}>
                <View style={styles.goingTag}>
                  <Text style={styles.goingTagText}>{Math.floor(Math.random() * (exp.capacity || 4)) + 1} going ✓</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )) : (
          <Text style={{ marginVertical: 20, textAlign: 'center', color: theme.icon }}>No upcoming experiences</Text>
        )}

        {/* Happening Now Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.happeningTitle, { color: theme.text }]}>Happening now</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.happeningScroll}>
          {HappeningNowData.map(item => (
            <View key={item.id} style={styles.liveItem}>
              <View style={styles.liveAvatarRing}>
                <Image source={{ uri: item.image }} style={styles.liveAvatar} />
                <View style={styles.liveEmojiBadge}>
                  <Text style={{ fontSize: 10 }}>{item.emoji}</Text>
                </View>
              </View>
              <Text style={[styles.liveName, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.liveActivity, { color: theme.icon }]}>{item.activity}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Co wants the debrief */}
        <View style={[styles.card, styles.debriefCard]}>
          <View style={styles.coCardHeader}>
            <View style={[styles.coAvatar, { backgroundColor: theme.tint, width: 40, height: 40 }]}>
              <Text style={[styles.coAvatarText, { fontSize: 14 }]}>Co</Text>
            </View>
            <View style={styles.coCardTexts}>
              <Text style={[styles.coTitle, { color: '#000', fontSize: 16 }]}>Co wants the debrief</Text>
              <Text style={[styles.coSubtitle, { color: '#333', fontSize: 13 }]}>How was Saturday? Give me the real version 👀</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Action Button for Voice Check-in */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: theme.tint }]}
        onPress={() => router.push('/voice')}
      >
        <Mic size={28} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  dateText: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 32,
    fontFamily: 'Georgia',
    lineHeight: 36,
  },
  greetingName: {
    fontStyle: 'italic',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  chapterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF1EE',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 30,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  chapterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 30,
  },
  coCard: {
    paddingTop: 24,
  },
  coCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  coAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  coAvatarText: {
    color: '#FFF',
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    fontSize: 18,
  },
  coCardTexts: {
    flex: 1,
  },
  coTitle: {
    fontSize: 20,
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  coSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  primaryBtnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#7A9A75',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  eventCard: {
    padding: 16,
  },
  eventMap: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mapPlaceholder: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mapPin: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mapPinText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  timeTag: {
    backgroundColor: '#7A9A75',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  timeTagText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  eventDetails: {},
  eventTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 20,
    fontFamily: 'Georgia',
  },
  chatBtn: {
    backgroundColor: '#FDF1EE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  chatBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  eventSub: {
    fontSize: 13,
    marginBottom: 16,
  },
  eventAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarStack: {
    flexDirection: 'row',
  },
  stackedAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  attendeeNames: {
    fontSize: 12,
    marginLeft: 12,
    flex: 1,
  },
  goingTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  goingTagText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  happeningTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D96C5B',
    marginRight: 6,
  },
  liveText: {
    color: '#D96C5B',
    fontSize: 12,
    fontWeight: '700',
  },
  happeningScroll: {
    marginBottom: 30,
  },
  liveItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  liveAvatarRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#DADBCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  liveAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  liveEmojiBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  liveName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  liveActivity: {
    fontSize: 12,
  },
  debriefCard: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  }
});

