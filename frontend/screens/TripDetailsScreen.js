import React from 'react';
import { View, Text, Button, Share, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect } from 'react';
import { TripContext } from '../contexts/TripContext';

export default function TripDetailsScreen({ route }) {
  const { tripId } = route.params;
  const navigation = useNavigation();
  const { trips, deleteTrip } = useContext(TripContext);

  const currentTrip = trips.find(t => t.id === tripId);

  useEffect(() => {
    if (!currentTrip) {
      const parent = navigation.getParent?.();
      if (parent?.canGoBack?.()) parent.goBack();
      else if (parent) parent.navigate('MainTabs');
    } else {
      navigation.setOptions({ title: currentTrip.name || 'Trip' });
    }
  }, [currentTrip, navigation]);

  const inviteCode = `TRIP-${String(tripId)}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my trip "${currentTrip?.name}" on TravelSquad! Use invite code: ${inviteCode}`,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const confirmDelete = () => {
    Alert.alert('Delete Trip', `Delete "${currentTrip?.name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteTrip(tripId);
          const parent = navigation.getParent?.();
          if (parent?.canGoBack?.()) parent.goBack();
          else if (parent) parent.navigate('MainTabs');
          else navigation.navigate('MainTabs');
        } 
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{currentTrip?.name}</Text>
        <Text style={styles.destination}>{currentTrip?.destination}</Text>

        <View style={styles.separator} />

        <Text style={styles.inviteLabel}>Invite Code</Text>
        <Text style={styles.inviteCode}>{inviteCode}</Text>

        <View style={styles.buttonContainer}>
          <Button title="Share" onPress={handleShare} />
          <View style={{ height: 10 }} />
          <Button title="Edit Trip" onPress={() => navigation.navigate('EditTrip', { tripId })} />
          <View style={{ height: 10 }} />
          <Button title="Add Members" onPress={() => navigation.navigate('AddMember', { tripId })} />
          <View style={{ height: 10 }} />
          <Button color="#dc3545" title="Delete Trip" onPress={confirmDelete} />
        </View>
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