import React, { useState, createContext } from 'react';

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
  const [trips, setTrips] = useState(INITIAL_TRIPS);

  const addTrip = (newTrip) => {
    setTrips(prevTrips => [...prevTrips, { ...newTrip, members: DUMMY_MEMBERS, events: [], expenses: [] }]);
  };

  const addEvent = (tripId, newEvent) => {
    setTrips(prevTrips => 
      prevTrips.map(trip => 
        trip.id === tripId 
          ? { ...trip, events: [...trip.events, newEvent] } 
          : trip
      )
    );
  };

  const addExpense = (tripId, newExpense) => {
    setTrips(prevTrips =>
      prevTrips.map(trip =>
        trip.id === tripId
          ? { ...trip, expenses: [...trip.expenses, newExpense] }
          : trip
      )
    );
  };

  return (
    <TripContext.Provider value={{ trips, addTrip, addEvent, addExpense }}>
      {children}
    </TripContext.Provider>
  );
};