import React from 'react';
import { View, StyleSheet, Alert, Switch } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import Screen from './ui/Screen';
import Card from './ui/Card';
import Button from './ui/Button';
import { Title, Subtitle, Body, Caption } from './ui/Typography';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function Profile() {
  const user = auth.currentUser;
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out!');
      })
      .catch(error => Alert.alert('Logout Error', error.message));
  };

  const getInitials = (email) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  };

  return (
    <Screen style={styles.container}>
      <View style={[styles.content, { padding: theme.spacing.l }]}>
        <Title style={[styles.pageTitle, { marginBottom: theme.spacing.xl }]}>Profile</Title>

        <Card style={[styles.profileCard, { paddingVertical: theme.spacing.xl, marginBottom: theme.spacing.xl }]}>
          <View style={[styles.avatarContainer, { marginBottom: theme.spacing.m }]}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={styles.avatar}
            >
              <Title style={styles.avatarText}>{getInitials(user?.email)}</Title>
            </LinearGradient>
          </View>

          <View style={styles.infoContainer}>
            <Caption>Logged in as</Caption>
            <Subtitle style={{ marginTop: theme.spacing.xs }}>{user ? user.email : 'Loading...'}</Subtitle>
          </View>
        </Card>

        <Card style={[styles.settingCard, { marginBottom: theme.spacing.l }]}>
          <View style={styles.settingRow}>
            <Body>Dark Mode</Body>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={{ borderColor: theme.colors.error }}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  pageTitle: {
  },
  profileCard: {
    alignItems: 'center',
  },
  avatarContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    marginBottom: 0,
  },
  infoContainer: {
    alignItems: 'center',
  },
  settingCard: {
    paddingVertical: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    marginTop: 'auto',
  },
});