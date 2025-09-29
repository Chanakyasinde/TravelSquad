import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { TripContext } from '../contexts/TripContext';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

export default function TripItineraryScreen({ route }) {
  const { trip } = route.params;
  const { trips } = useContext(TripContext);
  const navigation = useNavigation();

  const currentTrip = trips.find(t => t.id === trip.id);

  const sortedEvents = currentTrip.events.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  const renderEvent = ({ item }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventTime}>{dayjs(item.dateTime).format('h:mm A')}</Text>
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventLocation}>{item.location}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No events planned yet.</Text>}
      />
      <View style={styles.buttonContainer}>
        <Button 
          title="+ Add Event" 
          onPress={() => navigation.navigate('AddEvent', { tripId: trip.id })} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  eventItem: { 
    flexDirection: 'row', 
    backgroundColor: '#fff',
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#e0e0e0' 
  },
  eventTime: { 
    width: 80, 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#007bff' 
  },
  eventDetails: { flex: 1 },
  eventTitle: { fontSize: 18, fontWeight: '600' },
  eventLocation: { fontSize: 14, color: 'gray', marginTop: 4 },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 50, 
    fontSize: 16, 
    color: 'gray' 
  },
  buttonContainer: { 
    padding: 20,
    backgroundColor: '#f8f9fa' 
  },
});