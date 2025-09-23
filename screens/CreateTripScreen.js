import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from 'dayjs';
import { TripContext } from '../contexts/TripContext'; // Import the context

export default function CreateTripScreen({ navigation }) {
  // Get the addTrip function from the context
  const { addTrip } = useContext(TripContext);

  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [currentPicker, setCurrentPicker] = useState('start');

  const showDatePicker = (picker) => {
    setCurrentPicker(picker);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    if (currentPicker === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    hideDatePicker();
  };
  
  const handleCreateTrip = () => {
    if (!tripName.trim() || !destination.trim() || !startDate || !endDate) {
      Alert.alert('Missing Info', 'Please fill out all fields, including dates.');
      return;
    }
    if (endDate < startDate) {
      Alert.alert('Invalid Dates', 'End date cannot be before the start date.');
      return;
    }

    const newTrip = {
      id: Math.random().toString(),
      name: tripName,
      destination: destination,
      startDate: dayjs(startDate).format('MMM D, YYYY'),
      endDate: dayjs(endDate).format('MMM D, YYYY'),
    };

    // Call the global addTrip function from the context
    addTrip(newTrip);

    // Simply navigate back
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Trip Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Summer Vacation"
          value={tripName}
          onChangeText={setTripName}
        />
        <Text style={styles.label}>Destination</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Bali, Indonesia"
          value={destination}
          onChangeText={setDestination}
        />
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
            <Button title="Create Trip" onPress={handleCreateTrip} />
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