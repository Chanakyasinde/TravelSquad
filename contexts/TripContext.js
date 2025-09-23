import React, { useState, createContext } from 'react';

const INITIAL_TRIPS = [
  { id: '1', name: 'Paris Getaway', destination: 'Paris, France', startDate: 'Sep 10, 2025', endDate: 'Sep 17, 2025' },
  { id: '2', name: 'Tokyo Adventure', destination: 'Tokyo, Japan', startDate: 'Oct 22, 2025', endDate: 'Oct 30, 2025' },
];

export const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState(INITIAL_TRIPS);

  const addTrip = (newTrip) => {
    setTrips(prevTrips => [...prevTrips, newTrip]);
  };

  return (
    <TripContext.Provider value={{ trips, addTrip }}>
      {children}
    </TripContext.Provider>
  );
};