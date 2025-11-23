import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { TripContext } from '../contexts/TripContext';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import Screen from '../components/ui/Screen';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Title, Subtitle, Body, Caption } from '../components/ui/Typography';
import { useTheme } from '../contexts/ThemeContext';

export default function TripItineraryScreen({ route }) {
  const { tripId } = route.params;
  const { trips } = useContext(TripContext);
  const { theme } = useTheme();
  const navigation = useNavigation();

  const currentTrip = trips.find(t => t.id === tripId);

  useEffect(() => {
    if (!currentTrip) {
      const parent = navigation.getParent?.();
      if (parent?.canGoBack?.()) parent.goBack();
      else if (parent) parent.navigate('MainTabs');
    }
  }, [currentTrip, navigation]);

  const sortedEvents = [...(currentTrip?.events || [])].sort(
    (a, b) => new Date(a.dateTime || a.start_time) - new Date(b.dateTime || b.start_time)
  );

  const renderEvent = ({ item }) => (
    <Card style={[styles.eventItem, { marginBottom: theme.spacing.m }]}>
      <View style={[styles.timeContainer, {
        borderRightColor: theme.colors.border,
        paddingRight: theme.spacing.s,
        marginRight: theme.spacing.m
      }]}>
        <Subtitle style={[styles.eventTime, { color: theme.colors.primary }]}>{dayjs(item.dateTime || item.start_time).format('h:mm A')}</Subtitle>
        <Caption>{dayjs(item.dateTime || item.start_time).format('MMM D')}</Caption>
      </View>
      <View style={styles.eventDetails}>
        <Body style={styles.eventTitle}>{item.title}</Body>
        <Caption style={[styles.eventLocation, { color: theme.colors.text.secondary }]}>{item.location}</Caption>
      </View>
    </Card>
  );

  return (
    <Screen style={styles.container}>
      <View style={[styles.header, {
        paddingHorizontal: theme.spacing.l,
        paddingVertical: theme.spacing.m,
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.border
      }]}>
        <Title>Itinerary</Title>
        <Button
          title="+ Add Event"
          onPress={() => currentTrip && navigation.navigate('AddEvent', { tripId })}
          style={[styles.addButton, { paddingVertical: theme.spacing.s, paddingHorizontal: theme.spacing.m }]}
        />
      </View>
      <FlatList
        data={sortedEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => {
          const key = item.id ?? item.event_id;
          if (key !== undefined && key !== null) return String(key);
          return `${item.title}-${item.dateTime || item.start_time || Math.random().toString(36).slice(2)}`;
        }}
        ListEmptyComponent={<Body style={[styles.emptyText, { color: theme.colors.text.secondary }]}>No events planned yet.</Body>}
        contentContainerStyle={[styles.list, { padding: theme.spacing.m }]}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  addButton: {
  },
  list: {
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    width: 80,
    alignItems: 'center',
    borderRightWidth: 1,
  },
  eventTime: {
    marginBottom: 0,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  eventLocation: {
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
  },
});