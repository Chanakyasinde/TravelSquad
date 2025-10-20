import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 
export default function Profile() {
  const user = auth.currentUser;

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out!');
      })
      .catch(error => Alert.alert('Logout Error', error.message));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Logged in as:</Text>
        <Text style={styles.email}>{user ? user.email : 'Loading...'}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button title="Logout" color="#dc3545" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: 'gray',
  },
  email: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 'auto', 
    padding: 20,
  },
});