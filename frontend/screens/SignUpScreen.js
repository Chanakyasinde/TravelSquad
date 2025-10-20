import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // This imports the auth service we just configured

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Missing Info', 'Please enter both email and password.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        console.log('Registered with:', userCredentials.user.email);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Sign Up Failed', 'That email address is already in use!');
        } else if (error.code === 'auth/weak-password') {
          Alert.alert('Sign Up Failed', 'Your password should be at least 6 characters long.');
        } else {
          Alert.alert('Registration Error', error.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
        keyboardType="email-address"
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      
      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={handleSignUp} />
      </View>
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      justifyContent: 'center', 
      padding: 20,
      backgroundColor: '#fff',
    },
    title: { 
      fontSize: 32, 
      fontWeight: 'bold', 
      textAlign: 'center', 
      marginBottom: 30,
    },
    input: { 
      borderWidth: 1, 
      borderColor: '#ccc', 
      padding: 12, 
      borderRadius: 8, 
      marginBottom: 15,
      fontSize: 16,
    },
    buttonContainer: {
      marginVertical: 10,
    },
    linkText: {
      color: '#007AFF',
      textAlign: 'center',
      marginTop: 20,
    }
});