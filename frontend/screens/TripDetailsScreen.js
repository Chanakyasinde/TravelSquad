import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TripContext } from '../contexts/TripContext';
import Screen from '../components/ui/Screen';
import Button from '../components/ui/Button';
import { Title, Subtitle } from '../components/ui/Typography';
import { useTheme } from '../contexts/ThemeContext';

export default function TripDetailsScreen({ route }) {
  const { tripId } = route.params;
  const navigation = useNavigation();
  const { trips, deleteTrip } = useContext(TripContext);
  const { theme } = useTheme();

  const currentTrip = trips.find(t => t.id === tripId);

  useEffect(() => {
    if (!currentTrip) {
      const parent = navigation.getParent?.();
      if (parent?.canGoBack?.()) parent.goBack();
      else if (parent) parent.navigate('MainTabs');
    } else {
      navigation.setOptions({ title: currentTrip.name || 'Trip' });
    }
  }, [currentTrip, navigation]);

  const confirmDelete = () => {
    Alert.alert('Delete Trip', `Delete "${currentTrip?.name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteTrip(tripId);
          const parent = navigation.getParent?.();
          if (parent?.canGoBack?.()) parent.goBack();
          else if (parent) parent.navigate('MainTabs');
          else navigation.navigate('MainTabs');
        }
      }
    ]);
  };

  if (!currentTrip) return null;

  return (
    <Screen style={styles.container}>
      <View style={[styles.content, { padding: theme.spacing.l }]}>
        <View style={[styles.header, { marginBottom: theme.spacing.l }]}>
          <Title>{currentTrip.name}</Title>
          <Subtitle>{currentTrip.destination}</Subtitle>
        </View>

        <View style={[styles.separator, { backgroundColor: theme.colors.border, marginVertical: theme.spacing.l }]} />

        <View style={[styles.actions, { gap: theme.spacing.m }]}>
          <Button
            title="Add Members"
            onPress={() => navigation.navigate('AddMember', { tripId })}
            style={styles.actionButton}
          />
          <Button
            title="Delete Trip"
            onPress={confirmDelete}
            variant="outline"
            style={[styles.actionButton, { borderColor: theme.colors.error }]}
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
  header: {
  },
  separator: {
    height: 1,
  },
  actions: {
    marginTop: 'auto',
  },
  actionButton: {
    width: '100%',
  },
});