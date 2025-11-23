import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from 'dayjs';
import { TripContext } from '../contexts/TripContext';
import Screen from '../components/ui/Screen';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Title, Body, Caption } from '../components/ui/Typography';
import { theme } from '../theme/theme';

export default function CreateTripScreen({ navigation }) {
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

    addTrip(newTrip);

    navigation.goBack();
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>Plan a New Trip</Title>

        <Input
          label="Trip Name"
          placeholder="e.g., Summer Vacation"
          value={tripName}
          onChangeText={setTripName}
        />

        <Input
          label="Destination"
          placeholder="e.g., Bali, Indonesia"
          value={destination}
          onChangeText={setDestination}
        />

        <View style={styles.dateContainer}>
          <View style={styles.dateInputWrapper}>
            <Body style={styles.label}>Start Date</Body>
            <TouchableOpacity onPress={() => showDatePicker('start')} style={styles.dateInput}>
              <Body style={startDate ? styles.dateText : styles.placeholderText}>
                {startDate ? dayjs(startDate).format('MMM D, YYYY') : 'Select Date'}
              </Body>
            </TouchableOpacity>
          </View>

          <View style={styles.dateInputWrapper}>
            <Body style={styles.label}>End Date</Body>
            <TouchableOpacity onPress={() => showDatePicker('end')} style={styles.dateInput}>
              <Body style={endDate ? styles.dateText : styles.placeholderText}>
                {endDate ? dayjs(endDate).format('MMM D, YYYY') : 'Select Date'}
              </Body>
            </TouchableOpacity>
          </View>
        </View>

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
  label: {
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
    gap: theme.spacing.m,
  },
  dateInputWrapper: {
    flex: 1,
  },
  dateInput: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.m,
    justifyContent: 'center',
    height: 50,
  },
  placeholderText: {
    color: theme.colors.text.secondary,
  },
  dateText: {
    color: theme.colors.text.primary,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
});