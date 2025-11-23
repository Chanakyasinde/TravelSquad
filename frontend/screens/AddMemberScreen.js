import React, { useContext, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TripContext } from '../contexts/TripContext';
import Screen from '../components/ui/Screen';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Title } from '../components/ui/Typography';
import { theme } from '../theme/theme';

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
    <Screen style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>Add New Member</Title>

        <Input
          label="Member Name"
          placeholder="e.g., Alex Johnson"
          value={name}
          onChangeText={setName}
        />

        <Input
          label="Member Email"
          placeholder="e.g., alex@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={styles.buttonContainer}>
          <Button title="Add Member" onPress={handleAdd} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.l,
    flex: 1,
  },
  title: {
    marginBottom: theme.spacing.xl,
  },
  buttonContainer: {
    marginTop: theme.spacing.m,
  },
});