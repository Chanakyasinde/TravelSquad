import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from 'dayjs';
import { TripContext } from '../contexts/TripContext';

export default function EditTripScreen({ route, navigation }) {
  const { tripId } = route.params;
  const { trips, updateTrip } = useContext(TripContext);
  const trip = trips.find(t => t.id === tripId) || {};

  const [tripName, setTripName] = useState(trip.name || '');
  const [destination, setDestination] = useState(trip.destination || '');
  const [startDate, setStartDate] = useState(trip.startDate ? dayjs(trip.startDate, 'MMM D, YYYY').toDate() : null);
  const [endDate, setEndDate] = useState(trip.endDate ? dayjs(trip.endDate, 'MMM D, YYYY').toDate() : null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [currentPicker, setCurrentPicker] = useState('start');

  const showDatePicker = (picker) => {
    setCurrentPicker(picker);
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    if (currentPicker === 'start') setStartDate(date);
    else setEndDate(date);
    hideDatePicker();
  };

  useEffect(() => {
    // Keep fields in sync if trip loads after mount
    setTripName(trip.name || '');
    setDestination(trip.destination || '');
    setStartDate(trip.startDate ? dayjs(trip.startDate, 'MMM D, YYYY').toDate() : null);
    setEndDate(trip.endDate ? dayjs(trip.endDate, 'MMM D, YYYY').toDate() : null);
  }, [tripId, trip]);

  const handleSave = async () => {
    if (!tripName.trim() || !destination.trim() || !startDate || !endDate) {
      Alert.alert('Missing Info', 'Please fill out all fields, including dates.');
      return;
    }
    if (endDate < startDate) {
      Alert.alert('Invalid Dates', 'End date cannot be before the start date.');
      return;
    }

    const patch = {
      name: tripName,
      destination,
      startDate: dayjs(startDate).format('MMM D, YYYY'),
      endDate: dayjs(endDate).format('MMM D, YYYY'),
    };

    await updateTrip(tripId, patch);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Trip Name</Text>
        <TextInput style={styles.input} value={tripName} onChangeText={setTripName} />
        <Text style={styles.label}>Destination</Text>
        <TextInput style={styles.input} value={destination} onChangeText={setDestination} />

        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity onPress={() => showDatePicker('start')} style={styles.dateInput}>
          <Text style={startDate ? styles.dateText : styles.placeholderText}>
            {startDate ? dayjs(startDate).format('MMMM D, YYYY') : 'Select start date'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity onPress={() => showDatePicker('end')} style={styles.dateInput}>
          <Text style={endDate ? styles.dateText : styles.placeholderText}>
            {endDate ? dayjs(endDate).format('MMMM D, YYYY') : 'Select end date'}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          minimumDate={currentPicker === 'end' && startDate ? startDate : undefined}
        />
        <View style={styles.buttonContainer}>
          <Button title="Save Changes" onPress={handleSave} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  form: { padding: 20 },
  label: { fontSize: 18, fontWeight: '500', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 14 : 10, borderRadius: 8, fontSize: 16, marginBottom: 20 },
  dateInput: { borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 14 : 10, borderRadius: 8, marginBottom: 20 },
  placeholderText: { fontSize: 16, color: '#aaa' },
  dateText: { fontSize: 16, color: '#000' },
  buttonContainer: { marginTop: 20 },
});