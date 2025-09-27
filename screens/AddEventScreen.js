import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { TripContext } from '../contexts/TripContext';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from 'dayjs';

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
    <View style={styles.container}>
      <Text style={styles.label}>Event Title</Text>
      <TextInput style={styles.input} placeholder="e.g., Dinner at Le Jules Verne" value={title} onChangeText={setTitle} />
      
      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} placeholder="Eiffel Tower, Paris" value={location} onChangeText={setLocation} />

      <Text style={styles.label}>Date & Time</Text>
      <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.input}>
        <Text style={dateTime ? styles.dateText : styles.placeholderText}>
          {dateTime ? dayjs(dateTime).format('MMMM D, YYYY h:mm A') : 'Select Date & Time'}
        </Text>
      </TouchableOpacity>
      
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
  );
}

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      padding: 20, 
      backgroundColor: '#fff' 
    },
    label: { 
      fontSize: 16, 
      fontWeight: '500', 
      marginBottom: 8 
    },
    input: { 
      borderWidth: 1, 
      borderColor: '#ccc', 
      padding: 12, 
      borderRadius: 8, 
      marginBottom: 20, 
      justifyContent: 'center',
      fontSize: 16,
    },
    placeholderText: {
      color: '#aaa',
      fontSize: 16,
    },
    dateText: {
      color: '#000',
      fontSize: 16,
    },
    buttonContainer: {
      marginTop: 'auto',
      paddingBottom: 20,
    }
});