import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { TripContext } from '../contexts/TripContext';

export default function AddMemberScreen({ route, navigation }) {
  const { tripId } = route.params;
  const { trips, addMember } = useContext(TripContext);
  const currentTrip = trips.find(t => t.id === tripId);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleAdd = async () => {
    if (!name.trim() || !email.trim() || !email.includes('@')) {
      Alert.alert('Invalid Input', 'Please enter a valid name and email.');
      return;
    }

    const alreadyExists = (currentTrip.members || []).some(m => {
      const existingEmail = m.member_email || m.email || '';
      return existingEmail.toLowerCase() === email.toLowerCase();
    });
    if (alreadyExists) {
      Alert.alert('Duplicate', 'This email is already a member of the trip.');
      return;
    }

    await addMember(tripId, { name: name.trim(), email: email.trim() });

    
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      const parent = navigation.getParent?.();
      if (parent?.canGoBack?.()) parent.goBack();
      else if (parent) parent.navigate('TripDetails', { tripId });
      else navigation.navigate('MainTabs');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Member Name</Text>
      <TextInput style={styles.input} placeholder="e.g., Alex Johnson" value={name} onChangeText={setName} />
      <Text style={styles.label}>Member Email</Text>
      <TextInput style={styles.input} placeholder="e.g., alex@example.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <View style={styles.buttonContainer}>
        <Button title="Add Member" onPress={handleAdd} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 8, fontSize: 16, marginBottom: 20 },
  buttonContainer: { marginTop: 10 },
});