import React from 'react';
import { View, Text, Button, Share, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function TripDetailsScreen({ route }) {
  const { trip } = route.params;
  const navigation = useNavigation();

  // Use deterministic code so others can join: TRIP-{trip.id}
  const inviteCode = `TRIP-${String(trip.id)}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my trip "${trip.name}" on TravelSquad! Use invite code: ${inviteCode}`,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{trip.name}</Text>
        <Text style={styles.destination}>{trip.destination}</Text>

        <View style={styles.separator} />
        
        <Text style={styles.inviteLabel}>Invite Code:</Text>
        <Text style={styles.inviteCode}>{inviteCode}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button title="Share Invite" onPress={handleShare} />
        <View style={{ height: 12 }} />
        <Button
          title="Add Member"
          onPress={() => navigation.navigate('AddMember', { tripId: trip.id })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  destination: {
    fontSize: 18,
    color: 'gray',
  },
  separator: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 24,
  },
  inviteLabel: {
    fontSize: 16,
    color: '#343a40',
  },
  inviteCode: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
    color: '#007bff',
  },
  buttonContainer: {
    marginTop: 'auto', 
    padding: 20,
  },
});