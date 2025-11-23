import React, { useContext } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { TripContext } from '../contexts/TripContext';
import Screen from './ui/Screen';
import Card from './ui/Card';
import Button from './ui/Button';
import { Title, Subtitle, Caption, Body } from './ui/Typography';
import { useTheme } from '../contexts/ThemeContext';

dayjs.extend(customParseFormat);

export default function MyTrips({ navigation }) {
  const { trips } = useContext(TripContext);
  const { theme } = useTheme();

  const renderTrip = ({ item }) => {
    const endDate = dayjs(item.endDate, 'MMM D, YYYY');
    const isValid = endDate.isValid();
    const isCompleted = isValid ? endDate.isBefore(dayjs(), 'day') : false;

    const status = isCompleted ? 'Completed' : 'Upcoming';
    const statusColor = isCompleted ? theme.colors.success : theme.colors.primary;
    const badgeBg = isCompleted ? theme.colors.success + '20' : theme.colors.primary + '20';

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('TripDetails', { tripId: item.id })}
      >
        <Card style={[styles.tripItem, { marginBottom: theme.spacing.m }]}>
          <View style={[styles.tripHeader, { marginBottom: theme.spacing.xs }]}>
            <Subtitle style={{ fontWeight: '700' }}>{item.name}</Subtitle>
            <View style={[styles.badge, { backgroundColor: badgeBg, paddingHorizontal: theme.spacing.s }]}>
              <Caption style={{ color: statusColor, fontWeight: '600', fontSize: 12 }}>{status}</Caption>
            </View>
          </View>
          <Body style={{ marginBottom: theme.spacing.s }}>{item.destination}</Body>
          <View style={styles.dateContainer}>
            <Caption>{item.startDate} - {item.endDate}</Caption>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <Screen style={styles.container}>
      <View style={[styles.header, {
        paddingHorizontal: theme.spacing.l,
        paddingVertical: theme.spacing.m,
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.border
      }]}>
        <Title>My Trips</Title>
        <Button
          title="+ Add Trip"
          onPress={() => navigation.navigate('CreateTrip')}
          style={{ paddingVertical: theme.spacing.s, paddingHorizontal: theme.spacing.m }}
        />
      </View>
      <FlatList
        data={trips}
        renderItem={renderTrip}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: theme.spacing.m }}
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
  tripItem: {
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingVertical: 2,
    borderRadius: 9999,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});