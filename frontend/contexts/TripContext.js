import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { API_URL } from '@env';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebaseConfig';

// Resolve backend host for emulator/simulator or env override
const HOST =
  (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_API_HOST) ||
  (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');
const SERVER_URL = API_URL || `http://${HOST}:3001`;

// Fallback dummy data in case API fails
const DUMMY_MEMBERS = [
  { id: 'user_1', name: 'You' },
  { id: 'user_2', name: 'John Doe' },
  { id: 'user_3', name: 'Jane Smith' },
];

const INITIAL_TRIPS = [
  { 
    id: '1', 
    name: 'Paris Getaway', 
    destination: 'Paris, France', 
    startDate: 'Sep 10, 2025', 
    endDate: 'Sep 17, 2025',
    members: DUMMY_MEMBERS,
    events: [],
    expenses: [],
  },
  { 
    id: '2', 
    name: 'Tokyo Adventure', 
    destination: 'Tokyo, Japan', 
    startDate: 'Oct 22, 2025', 
    endDate: 'Oct 30, 2025',
    members: DUMMY_MEMBERS,
    events: [],
    expenses: [],
  },
];

export const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = auth.currentUser;

  // Save trips to AsyncStorage
  const saveTripsToStorage = async (tripsData) => {
    try {
      const jsonValue = JSON.stringify(tripsData);
      await AsyncStorage.setItem('trips', jsonValue);
    } catch (e) {
      console.error('Error saving trips to storage:', e);
    }
  };

  // Load trips from AsyncStorage
  const loadTripsFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('trips');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error loading trips from storage:', e);
      return null;
    }
  };

  // Fetch trips from API
  const fetchTrips = async () => {
    setLoading(true);
    try {
      // First try to load from local storage for immediate display
      const storedTrips = await loadTripsFromStorage();
      if (storedTrips) {
        setTrips(storedTrips);
      }
      
      // Then try to fetch from API
      if (user && user.email) {
        const response = await axios.get(`${SERVER_URL}/trips?userEmail=${user.email}`, { timeout: 10000 });
        if (response.data && Array.isArray(response.data)) {
          setTrips(response.data);
          // Save to AsyncStorage for offline access
          saveTripsToStorage(response.data);
        } else if (!storedTrips) {
          // Only use dummy data if we don't have stored trips
          setTrips(INITIAL_TRIPS);
        }
      } else if (!storedTrips) {
        // Use dummy data for development if not logged in and no stored trips
        setTrips(INITIAL_TRIPS);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError('Failed to load trips from server. Using locally stored data instead.');
      
      // If we already set trips from storage, don't override with dummy data
      if (trips.length === 0) {
        setTrips(INITIAL_TRIPS);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchTrips();
    // Add listener for auth state changes
    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchTrips();
    });
    return unsubscribe;
  }, []);

  const addTrip = async (newTrip) => {
    try {
      if (user && user.email) {
        // Add user as creator/member
        const tripWithUser = {
          ...newTrip,
          createdBy: user.email,
          members: [{ id: user.uid, name: user.displayName || user.email, email: user.email }]
        };
        
        const response = await axios.post(`${SERVER_URL}/trips`, tripWithUser, { timeout: 10000 });
        if (response.data && response.data.id) {
          const updatedTrips = [...trips, response.data];
          setTrips(updatedTrips);
          // Save to AsyncStorage
          saveTripsToStorage(updatedTrips);
          return response.data;
        }
      } else {
        // Offline mode - generate fake ID and add to local state
        const offlineTrip = { 
          ...newTrip, 
          id: Date.now().toString(),
          members: DUMMY_MEMBERS, 
          events: [], 
          expenses: [] 
        };
        const updatedTrips = [...trips, offlineTrip];
        setTrips(updatedTrips);
        // Save to AsyncStorage
        saveTripsToStorage(updatedTrips);
        return offlineTrip;
      }
    } catch (err) {
      console.error('Error adding trip:', err);
      Alert.alert('Error', 'Failed to create trip. Please try again.');
      
      // Add trip locally anyway for better user experience
      const offlineTrip = { 
        ...newTrip, 
        id: Date.now().toString(),
        members: DUMMY_MEMBERS, 
        events: [], 
        expenses: [] 
      };
      const updatedTrips = [...trips, offlineTrip];
      setTrips(updatedTrips);
      // Save to AsyncStorage
      saveTripsToStorage(updatedTrips);
      return offlineTrip;
    }
  };

  const addEvent = async (tripId, newEvent) => {
    try {
      if (user && user.email) {
        // Normalize date fields for backend
        const startTime =
          typeof newEvent.dateTime === 'string'
            ? newEvent.dateTime
            : newEvent.dateTime?.toISOString();

        const endTime =
          newEvent.endTime
            ? (typeof newEvent.endTime === 'string'
                ? newEvent.endTime
                : newEvent.endTime.toISOString())
            : null;

        const eventWithUser = {
          title: newEvent.title,
          description: newEvent.description || null,
          location: newEvent.location || null,
          startTime,
          endTime,
          createdBy: user.email,
        };

        const response = await axios.post(`${SERVER_URL}/trips/${tripId}/events`, eventWithUser, { timeout: 10000 });
        if (response.data) {
          // Normalize API event to UI shape (use dateTime for consistency)
          const apiEvent = response.data;
          const normalizedEvent = {
            id: apiEvent.id,
            title: apiEvent.title,
            description: apiEvent.description,
            location: apiEvent.location,
            dateTime: apiEvent.start_time, // map backend start_time to UI dateTime
            endTime: apiEvent.end_time,
            createdBy: apiEvent.created_by,
          };

          const updatedTrips = trips.map(trip =>
            trip.id === tripId
              ? { ...trip, events: [...(trip.events || []), normalizedEvent] }
              : trip
          );
          setTrips(updatedTrips);
          // Save to AsyncStorage
          saveTripsToStorage(updatedTrips);
          return normalizedEvent;
        }
      } else {
        // Offline mode
        const offlineEvent = { ...newEvent, id: Date.now().toString() };
        const updatedTrips = trips.map(trip =>
          trip.id === tripId
            ? { ...trip, events: [...(trip.events || []), offlineEvent] }
            : trip
        );
        setTrips(updatedTrips);
        // Save to AsyncStorage
        saveTripsToStorage(updatedTrips);
        return offlineEvent;
      }
    } catch (err) {
      console.error('Error adding event:', err);
      Alert.alert('Error', 'Failed to add event. Please try again.');

      // Still update UI optimistically
      const offlineEvent = { ...newEvent, id: Date.now().toString() };
      const updatedTrips = trips.map(trip =>
        trip.id === tripId
          ? { ...trip, events: [...(trip.events || []), offlineEvent] }
          : trip
      );
      setTrips(updatedTrips);
      // Save to AsyncStorage
      saveTripsToStorage(updatedTrips);
      return offlineEvent;
    }
  };

  const addExpense = async (tripId, newExpense) => {
    try {
      if (user && user.email) {
        const expenseWithUser = {
          ...newExpense,
          createdBy: user.email,
          tripId
        };
        
        const response = await axios.post(`${SERVER_URL}/trips/${tripId}/expenses`, expenseWithUser, { timeout: 10000 });
        if (response.data) {
          const updatedTrips = trips.map(trip =>
            trip.id === tripId
              ? { ...trip, expenses: [...(trip.expenses || []), response.data] }
              : trip
          );
          setTrips(updatedTrips);
          // Save to AsyncStorage
          saveTripsToStorage(updatedTrips);
          return response.data;
        }
      } else {
        // Offline mode
        const offlineExpense = { ...newExpense, id: Date.now().toString() };
        const updatedTrips = trips.map(trip =>
          trip.id === tripId
            ? { ...trip, expenses: [...(trip.expenses || []), offlineExpense] }
            : trip
        );
        setTrips(updatedTrips);
        // Save to AsyncStorage
        saveTripsToStorage(updatedTrips);
        return offlineExpense;
      }
    } catch (err) {
      console.error('Error adding expense:', err);
      Alert.alert('Error', 'Failed to add expense. Please try again.');
      
      // Still update UI optimistically
      const offlineExpense = { ...newExpense, id: Date.now().toString() };
      const updatedTrips = trips.map(trip =>
        trip.id === tripId
          ? { ...trip, expenses: [...(trip.expenses || []), offlineExpense] }
          : trip
      );
      setTrips(updatedTrips);
      // Save to AsyncStorage
      saveTripsToStorage(updatedTrips);
      return offlineExpense;
    }
  };

  const addMember = async (tripId, member) => {
    try {
      if (user && user.email) {
        const response = await axios.post(`${SERVER_URL}/trips/${tripId}/members`, {
          email: member.email,
          name: member.name,
        }, { timeout: 10000 });
        const apiMember = response.data; // { id, trip_id, member_email, member_name }
        const updatedTrips = trips.map(trip =>
          trip.id === tripId
            ? { ...trip, members: [...(trip.members || []), apiMember] }
            : trip
        );
        setTrips(updatedTrips);
        saveTripsToStorage(updatedTrips);
        return apiMember;
      } else {
        const offlineMember = {
          id: member.email || Date.now().toString(),
          name: member.name,
          email: member.email,
        };
        const updatedTrips = trips.map(trip =>
          trip.id === tripId
            ? { ...trip, members: [...(trip.members || []), offlineMember] }
            : trip
        );
        setTrips(updatedTrips);
        saveTripsToStorage(updatedTrips);
        return offlineMember;
      }
    } catch (err) {
      console.error('Error adding member:', err);
      Alert.alert('Error', 'Failed to add member. Please try again.');
      const offlineMember = {
        id: member.email || Date.now().toString(),
        name: member.name,
        email: member.email,
      };
      const updatedTrips = trips.map(trip =>
        trip.id === tripId
          ? { ...trip, members: [...(trip.members || []), offlineMember] }
          : trip
      );
      setTrips(updatedTrips);
      saveTripsToStorage(updatedTrips);
      return offlineMember;
    }
  };

  const joinTrip = async (inviteCode) => {
    try {
      if (user && user.email) {
        const response = await axios.post(`${SERVER_URL}/trips/join`, {
          inviteCode,
          email: user.email,
          name: user.displayName || user.email,
        }, { timeout: 10000 });
        if (response.data) {
          // Add/merge trip into local state
          const joinedTrip = response.data;
          const exists = trips.some(t => String(t.id) === String(joinedTrip.id));
          const updatedTrips = exists
            ? trips.map(t => (String(t.id) === String(joinedTrip.id) ? joinedTrip : t))
            : [...trips, joinedTrip];
          setTrips(updatedTrips);
          // Save to AsyncStorage
          saveTripsToStorage(updatedTrips);
          return joinedTrip;
        }
      } else {
        Alert.alert('Login Required', 'Please log in to join a trip.');
      }
    } catch (err) {
      console.error('Error joining trip:', err);
      Alert.alert('Error', 'Failed to join trip. Check the invite code and try again.');
      return null;
    }
  };

  return (
    <TripContext.Provider value={{ 
      trips, 
      loading, 
      error, 
      addTrip, 
      addEvent, 
      addExpense, 
      addMember,
      joinTrip,
      refreshTrips: fetchTrips 
    }}>
      {children}
    </TripContext.Provider>
  );
};