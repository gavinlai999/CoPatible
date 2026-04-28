import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MapPin, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

const MOCK_CIRCLES = [
  {
    id: '1',
    title: 'Go-Kart Grand Prix',
    location: 'Kartland SF',
    status: 'Circle Activated',
    spots: '4 confirmed',
    image: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?q=80&w=3270&auto=format&fit=crop',
    attendees: [
      { id: '1', avatar: 'https://i.pravatar.cc/150?u=rachel', text: 'New to City', align: 'flex-start' as const },
      { id: '2', avatar: 'https://i.pravatar.cc/150?u=marcus', text: 'Needs to Let Loose', align: 'flex-end' as const },
      { id: '3', avatar: 'https://i.pravatar.cc/150?u=sarah', text: 'Loves competition', align: 'center' as const },
    ]
  },
  {
    id: '2',
    title: 'Evening Coffee',
    location: 'Blue Bottle',
    status: 'Matching...',
    spots: '2 confirmed',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=3000&auto=format&fit=crop',
    attendees: [
      { id: '4', avatar: 'https://i.pravatar.cc/150?u=jane', text: 'Deep Conversation', align: 'flex-end' as const },
      { id: '5', avatar: 'https://i.pravatar.cc/150?u=joe', text: 'Chill night', align: 'flex-start' as const },
    ]
  },
  {
    id: '3',
    title: 'Pottery Class',
    location: 'Clay Studio',
    status: 'Upcoming',
    spots: '5 confirmed',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=3270&auto=format&fit=crop',
    attendees: [
      { id: '6', avatar: 'https://i.pravatar.cc/150?u=anna', text: 'Creative outlet', align: 'center' as const },
      { id: '7', avatar: 'https://i.pravatar.cc/150?u=bob', text: 'Low pressure', align: 'flex-start' as const },
      { id: '8', avatar: 'https://i.pravatar.cc/150?u=charlie', text: 'First time trying', align: 'flex-end' as const },
    ]
  }
];

export default function LiveScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
          <Text style={styles.mainTitle}>Your Circles</Text>
          <Text style={styles.subtitle}>See who&apos;s confirmed and what they&apos;re feeling</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridScroll}
      >
        <View style={styles.gridContainer}>
          {MOCK_CIRCLES.map((circle) => (
            <View key={circle.id} style={styles.verticalCard}>
            <View style={styles.cardHeader}>
                <Image source={{ uri: circle.image }} style={styles.headerImage} />
                <View style={styles.headerOverlay} />
                <View style={styles.cardInfo}>
                    <Text style={styles.circleTitle}>{circle.title}</Text>
                    <View style={styles.locationRow}>
                        <MapPin size={12} color="white" />
                        <Text style={styles.locationText}>{circle.location}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.attendeesContainer}>
                {circle.attendees.map((att, index) => (
                  <View 
                    key={att.id} 
                    style={[styles.attendeeNode, { alignSelf: att.align, marginTop: index === 0 ? 0 : -20 }]}
                  >
                    <Image source={{ uri: att.avatar }} style={styles.nodeAvatar} />
                    <View style={[styles.nodeBubble, att.align === 'flex-end' ? styles.bubbleLeft : styles.bubbleRight]}>
                       <Text style={styles.bubbleText}>{att.text}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.actionButtons}>
                 <TouchableOpacity style={styles.secondaryButton}>
                   <X size={20} color={colors.text.secondary} />
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.primaryButton}>
                   <Text style={styles.primaryButtonText}>I'm in</Text>
                 </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 10, marginBottom: 20 },
  mainTitle: { ...typography.h1, color: colors.text.primary, letterSpacing: -1 },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: 4 },
  gridScroll: { paddingHorizontal: 20, paddingBottom: 40 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20 },
  verticalCard: {
    width: 300,
    backgroundColor: '#FAF9F6',
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  cardHeader: { height: 160, width: '100%', position: 'relative' },
  headerImage: { width: '100%', height: '100%' },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardInfo: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  circleTitle: { ...typography.h3, color: 'white', fontSize: 22, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  locationText: { ...typography.caption, color: 'white', fontWeight: '600' },
  
  cardBody: { padding: 20, flex: 1, justifyContent: 'space-between', minHeight: 400 },
  attendeesContainer: { flex: 1, paddingTop: 20 },
  attendeeNode: { position: 'relative', marginBottom: 30, zIndex: 1 },
  nodeAvatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 3, borderColor: 'white', backgroundColor: '#eee' },
  nodeBubble: {
    position: 'absolute',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    minWidth: 120,
    top: -10,
    zIndex: 2,
  },
  bubbleRight: { left: 45 },
  bubbleLeft: { right: 45 },
  bubbleText: { ...typography.caption, color: colors.text.primary, fontWeight: '600', textAlign: 'center' },
  
  actionButtons: { flexDirection: 'row', gap: 12, marginTop: 20 },
  secondaryButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  primaryButton: { flex: 1, height: 60, borderRadius: 30, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  primaryButtonText: { ...typography.bodyBold, color: 'white', fontSize: 18 }
});

