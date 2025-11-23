import React, { useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TripContext } from '../contexts/TripContext';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from 'dayjs';
import Screen from '../components/ui/Screen';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Title, Body } from '../components/ui/Typography';
import { theme } from '../theme/theme';

export default function AddEventScreen({ route, navigation }) {
  const { tripId } = route.params;
  const { addEvent } = useContext(TripContext);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState(null);
  const [isPickerVisible, setPickerVisible] = useState(false);

  const handleConfirm = (date) => {
    setDateTime(date);
    setPickerVisible(false);
  };

  const handleAddEvent = () => {
    if (!title || !location || !dateTime) {
      Alert.alert('Missing Info', 'Please fill out all fields.');
      return;
    }
    const newEvent = {
      id: Math.random().toString(),
      title,
      location,
      dateTime,
    };
    addEvent(tripId, newEvent);
    navigation.goBack();
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>Add New Event</Title>

        <Input
          label="Event Title"
          placeholder="e.g., Dinner at Le Jules Verne"
          value={title}
          onChangeText={setTitle}
        />

        <Input
          label="Location"
          placeholder="Eiffel Tower, Paris"
          value={location}
          onChangeText={setLocation}
        />

        <View style={styles.dateInputWrapper}>
          <Body style={styles.label}>Date & Time</Body>
          <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.dateInput}>
            <Body style={dateTime ? styles.dateText : styles.placeholderText}>
              {dateTime ? dayjs(dateTime).format('MMMM D, YYYY h:mm A') : 'Select Date & Time'}
            </Body>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={isPickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={() => setPickerVisible(false)}
        />

        <View style={styles.buttonContainer}>
          <Button title="Save Event" onPress={handleAddEvent} />
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
  dateInputWrapper: {
    marginBottom: theme.spacing.m,
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