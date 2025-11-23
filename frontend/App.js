import React from 'react';
import { TripProvider } from './contexts/TripContext';
import { ThemeProvider } from './contexts/ThemeContext';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <TripProvider>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </TripProvider>
  );
}