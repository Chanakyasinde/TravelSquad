import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import Screen from '../components/ui/Screen';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Title, Subtitle, Caption } from '../components/ui/Typography';
import { theme } from '../theme/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Missing Info', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in with:', userCredentials.user.email);
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        Alert.alert('Login Failed', 'Incorrect email or password. Please try again.');
      } else {
        Alert.alert('Login Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen gradientBackground style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Title style={styles.title}>Welcome Back!</Title>
          <Subtitle style={styles.subtitle}>Log in to manage your trips.</Subtitle>
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
            title="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          />

          <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.linkContainer}>
            <Caption style={styles.linkText}>Don't have an account? <Caption style={styles.linkHighlight}>Sign Up</Caption></Caption>
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