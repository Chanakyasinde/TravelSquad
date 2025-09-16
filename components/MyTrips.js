import { View, Text, StyleSheet } from 'react-native';

export default function MyTrips() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>My Trips</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '600' },
}); 