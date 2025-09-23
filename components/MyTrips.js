import React, { useContext } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TripContext } from '../contexts/TripContext'; 

export default function MyTrips({ navigation }) {
  const { trips } = useContext(TripContext);

  const renderTrip = ({ item }) => (
    <TouchableOpacity
      style={styles.tripItem}
      onPress={() => navigation.navigate('TripDetails', { trip: item })}
    >
      <Text style={styles.tripName}>{item.name}</Text>
      <Text style={styles.tripDestination}>{item.destination}</Text>
      <Text style={styles.tripDates}>{item.startDate} - {item.endDate}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Trips</Text>
        <Button
          title="+ Add Trip"
          onPress={() => navigation.navigate('CreateTrip')}
        />
      </View>
      <FlatList
        data={trips}
        renderItem={renderTrip}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: { padding: 16 },
  tripItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  tripName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tripDestination: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  tripDates: {
    fontSize: 12,
    color: 'gray',
    marginTop: 8,
  },
});