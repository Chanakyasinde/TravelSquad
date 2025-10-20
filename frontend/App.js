import React from 'react';
import { TripProvider } from './contexts/TripContext';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <TripProvider>
      <RootNavigator />
    </TripProvider>
  );
}