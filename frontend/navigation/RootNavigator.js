import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import StackNavigator from './StackNavigator'; 
import AuthNavigator from './AuthNavigator'; 

export default function RootNavigator() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {user ? <StackNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}