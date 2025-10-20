import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import MyTrips from '../components/MyTrips';
import Chat from '../components/Chat';
import Profile from '../components/Profile';
import CreateTripScreen from '../screens/CreateTripScreen';
import TripDetailsScreen from '../screens/TripDetailsScreen';

import TripItineraryScreen from '../screens/TripItineraryScreen';
import AddEventScreen from '../screens/AddEventScreen';

import TripExpensesScreen from '../screens/TripExpensesScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';


const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

function TripTopTabNavigator({ route }) {
  const { trip } = route.params;
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="Details" component={TripDetailsScreen} initialParams={{ trip: trip }} />
      <TopTab.Screen name="Itinerary" component={TripItineraryScreen} initialParams={{ trip: trip }} />
      <TopTab.Screen name="Expenses" component={TripExpensesScreen} initialParams={{ trip: trip }} />
    </TopTab.Navigator>
  );
}

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'MyTrips') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Chat') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <BottomTab.Screen name="MyTrips" component={MyTrips} options={{ title: 'My Trips' }} />
      <BottomTab.Screen name="Chat" component={Chat} />
      <BottomTab.Screen name="Profile" component={Profile} />
    </BottomTab.Navigator>
  );
}

export default function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="CreateTrip" component={CreateTripScreen} options={{ headerShown: true, title: 'Create Trip' }} />
      <Stack.Screen name="TripDetails" component={TripTopTabNavigator} options={({ route }) => ({ headerShown: true, title: route.params.trip.name })} />
      <Stack.Screen name="AddEvent" component={AddEventScreen} options={{ headerShown: true, title: 'Add New Event' }} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ headerShown: true, title: 'Add New Expense' }} />
    </Stack.Navigator>
  );
}