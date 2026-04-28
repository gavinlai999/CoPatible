import { View, Text, StyleSheet } from "react-native";

export default function HostExperienceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Host an Experience</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
