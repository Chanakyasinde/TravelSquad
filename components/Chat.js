import { View, Text, StyleSheet } from 'react-native';

export default function Chat() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Chat</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '600' },
}); 