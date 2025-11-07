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

  // Quiet background persistence with retries; replaces local trip once server responds
  const persistTripToServer = (localId, tripPayload, attempt = 1) => {
    const maxAttempts = 3;
    const delayMs = 5000;

    axios.post(`${SERVER_URL}/trips`, tripPayload, { timeout: 4000 })
      .then((response) => {
        if (response.data && response.data.id) {
          setTrips(prev => {
            const arr = prev.map(t => (t.id === localId ? response.data : t));
            saveTripsToStorage(arr);
            return arr;
          });
        }
      })
      .catch(() => {
        if (attempt < maxAttempts) {
          setTimeout(() => persistTripToServer(localId, tripPayload, attempt + 1), delayMs);
        } else {
          // Mark as not pending after final attempt
          setTrips(prev => {
            const arr = prev.map(t => (t.id === localId ? { ...t, pending: false } : t));
            saveTripsToStorage(arr);
            return arr;
          });
        }
      });
  };

  const addTrip = async (newTrip) => {
    // Optimistic local trip so UI updates instantly
    const localTrip = {
      ...newTrip,
      id: `local_${Date.now()}`,
      members: user && user.email
        ? [{ id: user.uid || `local_${Date.now()}`, name: user.displayName || user.email, email: user.email }]
        : DUMMY_MEMBERS,
      events: [],
      expenses: [],
      pending: true,
    };

    setTrips(prev => {
      const arr = [...prev, localTrip];
      saveTripsToStorage(arr);
      return arr;
    });

    if (user && user.email) {
      // Persist in background (silent retries)
      const tripWithUser = {
        ...newTrip,
        createdBy: user.email,
        members: [{ email: user.email, name: user.displayName || user.email }],
      };
      persistTripToServer(localTrip.id, tripWithUser);
    }

    return localTrip;
  };

  const persistEventToServer = (tripId, localId, newEvent, attempt = 1) => {
    const maxAttempts = 3;
    const delayMs = 5000;

    const startTime =
      typeof newEvent.dateTime === 'string'
        ? newEvent.dateTime
        : newEvent.dateTime?.toISOString();

    const endTime = newEvent.endTime
      ? (typeof newEvent.endTime === 'string'
          ? newEvent.endTime
          : newEvent.endTime.toISOString())
      : null;

    const payload = {
      title: newEvent.title,
      description: newEvent.description || null,
      location: newEvent.location || null,
      startTime,
      endTime,
      createdBy: auth.currentUser?.email,
    };

    axios.post(`${SERVER_URL}/trips/${tripId}/events`, payload, { timeout: 4000 })
      .then((response) => {
        const apiEvent = response.data;
        const normalizedEvent = {
          id: apiEvent.id,
          title: apiEvent.title,
          description: apiEvent.description,
          location: apiEvent.location,
          dateTime: apiEvent.start_time,
          endTime: apiEvent.end_time,
          createdBy: apiEvent.created_by,
          pending: false,
        };
        setTrips(prev => {
          const updated = prev.map(t =>
            t.id === tripId
              ? { ...t, events: (t.events || []).map(e => (e.id === localId ? normalizedEvent : e)) }
              : t
          );
          saveTripsToStorage(updated);
          return updated;
        });
      })
      .catch(() => {
        if (attempt < maxAttempts) {
          setTimeout(() => persistEventToServer(tripId, localId, newEvent, attempt + 1), delayMs);
        } else {
          setTrips(prev => {
            const updated = prev.map(t =>
              t.id === tripId
                ? { ...t, events: (t.events || []).map(e => (e.id === localId ? { ...e, pending: false } : e)) }
                : t
            );
            saveTripsToStorage(updated);
            return updated;
          });
        }
      });
  };

  const addEvent = async (tripId, newEvent) => {
    const localEvent = {
      ...newEvent,
      id: `local_event_${Date.now()}`,
      pending: true,
    };

    setTrips(prev => {
      const updated = prev.map(t =>
        t.id === tripId
          ? { ...t, events: [...(t.events || []), localEvent] }
          : t
      );
      saveTripsToStorage(updated);
      return updated;
    });

    if (auth.currentUser?.email) {
      persistEventToServer(tripId, localEvent.id, newEvent);
    }

    return localEvent;
  };

  // Quiet background persistence for expenses with retries
  const persistExpenseToServer = (tripId, localId, expensePayload, attempt = 1) => {
    const maxAttempts = 3;
    const delayMs = 4000;

    axios.post(`${SERVER_URL}/trips/${tripId}/expenses`, expensePayload, { timeout: 4000 })
      .then((response) => {
        if (response.data) {
          setTrips(prev => {
            const updated = prev.map(trip =>
              trip.id === tripId
                ? { ...trip, expenses: (trip.expenses || []).map(e => 
                    e.id === localId ? { ...response.data, pending: false } : e
                  )}
                : trip
            );
            saveTripsToStorage(updated);
            return updated;
          });
        }
      })
      .catch(() => {
        if (attempt < maxAttempts) {
          setTimeout(() => persistExpenseToServer(tripId, localId, expensePayload, attempt + 1), delayMs);
        } else {
          // Mark as not pending after final attempt
          setTrips(prev => {
            const updated = prev.map(trip =>
              trip.id === tripId
                ? { ...trip, expenses: (trip.expenses || []).map(e => 
                    e.id === localId ? { ...e, pending: false } : e
                  )}
                : trip
            );
            saveTripsToStorage(updated);
            return updated;
          });
        }
      });
  };

  const addExpense = (tripId, newExpense) => {
    // Create optimistic local expense
    const localExpense = {
      ...newExpense,
      id: `local_expense_${Date.now()}`,
      pending: true
    };
    
    // Update UI immediately
    const updatedTrips = trips.map(trip =>
      trip.id === tripId
        ? { ...trip, expenses: [...(trip.expenses || []), localExpense] }
        : trip
    );
    setTrips(updatedTrips);
    saveTripsToStorage(updatedTrips);
    
    // Persist in background if online
    if (user && user.email) {
      const expenseWithUser = {
        ...newExpense,
        createdBy: user.email,
        tripId
      };
      persistExpenseToServer(tripId, localExpense.id, expenseWithUser);
    }
    
    return localExpense;
  };

  // New helper: persist member quietly with retries
  const persistMemberToServer = (tripId, localId, member, attempt = 1) => {
    const maxAttempts = 3;
    const delayMs = 5000;
  
    axios.post(`${SERVER_URL}/trips/${tripId}/members`, {
      email: member.email,
      name: member.name,
    }, { timeout: 4000 })
      .then((response) => {
        const apiMember = response.data; // { id, trip_id, member_email, member_name }
        const normalizedMember = {
          id: apiMember.id,
          member_email: apiMember.member_email,
          member_name: apiMember.member_name,
          email: apiMember.member_email,
          name: apiMember.member_name,
          pending: false,
        };
        setTrips(prev => {
          const updated = prev.map(t =>
            t.id === tripId
              ? { ...t, members: (t.members || []).map(m => (m.id === localId ? normalizedMember : m)) }
              : t
          );
          saveTripsToStorage(updated);
          return updated;
        });
      })
      .catch(() => {
        if (attempt < maxAttempts) {
          setTimeout(() => persistMemberToServer(tripId, localId, member, attempt + 1), delayMs);
        } else {
          setTrips(prev => {
            const updated = prev.map(t =>
              t.id === tripId
                ? { ...t, members: (t.members || []).map(m => (m.id === localId ? { ...m, pending: false } : m)) }
                : t
            );
            saveTripsToStorage(updated);
            return updated;
          });
        }
      });
  };

  // Replace existing addMember with optimistic version
  const addMember = async (tripId, member) => {
    const localMember = {
      id: `local_member_${Date.now()}`,
      name: member.name,
      email: member.email,
      pending: true,
    };
  
    setTrips(prev => {
      const updated = prev.map(t =>
        t.id === tripId
          ? { ...t, members: [...(t.members || []), localMember] }
          : t
      );
      saveTripsToStorage(updated);
      return updated;
    });
  
    if (user && user.email) {
      persistMemberToServer(tripId, localMember.id, member);
    }
  
    return localMember;
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

  // Update trip details
  const updateTrip = async (tripId, patch) => {
    try {
      if (user && user.email) {
        const response = await axios.put(`${SERVER_URL}/trips/${tripId}`, patch, { timeout: 10000 });
        if (response.data) {
          const updatedTrips = trips.map(t => (t.id === tripId ? { ...t, ...response.data } : t));
          setTrips(updatedTrips);
          saveTripsToStorage(updatedTrips);
          return response.data;
        }
      }
      // Offline: update locally
      const updatedTrips = trips.map(t => (t.id === tripId ? { ...t, ...patch } : t));
      setTrips(updatedTrips);
      saveTripsToStorage(updatedTrips);
      return patch;
    } catch (err) {
      console.error('Error updating trip:', err);
      Alert.alert('Error', 'Failed to update trip. Please try again.');
      const updatedTrips = trips.map(t => (t.id === tripId ? { ...t, ...patch } : t));
      setTrips(updatedTrips);
      saveTripsToStorage(updatedTrips);
      return patch;
    }
  };

  // Delete trip
  const deleteTrip = async (tripId) => {
    // Optimistic local delete
    setTrips(prev => {
      const updated = prev.filter(t => t.id !== tripId);
      saveTripsToStorage(updated);
      return updated;
    });

    // Silent background server delete with short timeout
    if (user && user.email) {
      try {
        await axios.delete(`${SERVER_URL}/trips/${tripId}`, { timeout: 4000 });
      } catch (_) {
        // ignore; local state already updated
      }
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
      refreshTrips: fetchTrips,
      updateTrip,
      deleteTrip
    }}>
      {children}
    </TripContext.Provider>
  );
};