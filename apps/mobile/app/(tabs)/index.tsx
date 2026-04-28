import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Colors, Spacing } from '../../constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const API_URL = 'http://localhost:3000'; // Real app uses environment variables

export default function DashboardScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dynamic matches from backend for the mock user
    fetch(`${API_URL}/matches/mock-user-123`)
      .then(res => res.json())
      .then(data => {
        // data contains matched objects embellished with experience
        // Ensure data is an array
        if (Array.isArray(data)) {
          setMatches(data);
        } else {
          throw new Error("Invalid data format");
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn("Backend down or error, using fallback data for UI preview", err);
        setMatches([
          { id: 'offline-1', title: 'Quiet Dinner in Hayes Valley', capacity: 5, container_type: 'Grounding' },
          { id: 'offline-2', title: 'Founders Celebration Drinks', capacity: 6, container_type: 'Celebratory' }
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Your Moments</Text>
        <Text style={[styles.subtitle, { color: theme.icon }]}>Curated based on your last check-in</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.tint} style={{ marginTop: 50 }} />
      ) : (
        <View style={styles.list}>
          {matches.length === 0 && (
            <Text style={{ color: theme.text, textAlign: 'center', marginTop: 40 }}>
              No clusters found yet. Do a voice check-in!
            </Text>
          )}
          {matches.map(match => (
            <TouchableOpacity 
              key={match.id} 
              style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push(`/experience/${match.id}`)}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.tag, { color: theme.accent }]}>{match.container_type}</Text>
              </View>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{match.title}</Text>
              <Text style={{ color: theme.icon, marginTop: Spacing.xs }}>
                {match.capacity} people
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.xl, paddingTop: Spacing.xxl + 20 },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, marginTop: Spacing.xs },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  card: {
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
  tag: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  cardTitle: { fontSize: 20, fontWeight: '600' }
});
