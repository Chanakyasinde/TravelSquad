import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import Screen from '../components/ui/Screen';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Title, Subtitle, Caption } from '../components/ui/Typography';
import { theme } from '../theme/theme';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Missing Info', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registered with:', userCredentials.user.email);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Sign Up Failed', 'That email address is already in use!');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Sign Up Failed', 'Your password should be at least 6 characters long.');
      } else {
        Alert.alert('Registration Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen gradientBackground style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Title style={styles.title}>Create Account</Title>
          <Subtitle style={styles.subtitle}>Join TravelSquad today!</Subtitle>
        </View>

        <View style={styles.form}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title="Sign Up"
            onPress={handleSignUp}
            loading={loading}
            style={styles.button}
          />

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
            <Caption style={styles.linkText}>Already have an account? <Caption style={styles.linkHighlight}>Login</Caption></Caption>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  content: {
    padding: theme.spacing.l,
    justifyContent: 'center',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing.m,
  },
  linkContainer: {
    marginTop: theme.spacing.l,
    alignItems: 'center',
  },
  linkText: {
    textAlign: 'center',
  },
  linkHighlight: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});