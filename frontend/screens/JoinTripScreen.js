import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { TripContext } from '../contexts/TripContext';

export default function JoinTripScreen({ navigation }) {
  const { joinTrip } = useContext(TripContext);
  const [inviteCode, setInviteCode] = useState('');

  const handleJoin = async () => {
    const code = inviteCode.trim().toUpperCase();
    if (!code.startsWith('TRIP-') || code.length < 6) {
      Alert.alert('Invalid Code', 'Invite code must look like TRIP-123.');
      return;
    }
    const trip = await joinTrip(code);
    if (trip) {
      Alert.alert('Joined', `You joined "${trip.name}".`);
      navigation.navigate('TripDetails', { tripId: trip.id });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Invite Code</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., TRIP-123"
        autoCapitalize="characters"
        value={inviteCode}
        onChangeText={setInviteCode}
      />
      <View style={styles.buttonContainer}>
        <Button title="Join Trip" onPress={handleJoin} />
      </View>
      <Text style={styles.helper}>Ask a friend to share their code: TRIP-{String(123)} format.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  label: { fontSize: 18, fontWeight: '500', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 8, fontSize: 16, marginBottom: 20 },
  buttonContainer: { marginTop: 8 },
  helper: { marginTop: 16, color: 'gray' }
});