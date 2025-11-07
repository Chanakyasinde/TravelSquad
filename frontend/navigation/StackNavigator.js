import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import MyTrips from '../components/MyTrips';
import Profile from '../components/Profile';
import CreateTripScreen from '../screens/CreateTripScreen';
import TripDetailsScreen from '../screens/TripDetailsScreen';

import TripItineraryScreen from '../screens/TripItineraryScreen';
import AddEventScreen from '../screens/AddEventScreen';

import TripExpensesScreen from '../screens/TripExpensesScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import AddMemberScreen from '../screens/AddMemberScreen';
import JoinTripScreen from '../screens/JoinTripScreen';
import TripChatScreen from '../screens/TripChatScreen';
import EditTripScreen from '../screens/EditTripScreen';


const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

function TripTopTabNavigator({ route }) {
  const { tripId } = route.params;
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="Details" component={TripDetailsScreen} initialParams={{ tripId }} />
      <TopTab.Screen name="Itinerary" component={TripItineraryScreen} initialParams={{ tripId }} />
      <TopTab.Screen name="Expenses" component={TripExpensesScreen} initialParams={{ tripId }} />
      <TopTab.Screen name="Chat" component={TripChatScreen} initialParams={{ tripId }} /> 
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
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <BottomTab.Screen name="MyTrips" component={MyTrips} options={{ title: 'My Trips' }} />
      <BottomTab.Screen name="Profile" component={Profile} />
    </BottomTab.Navigator>
  );
}

export default function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="CreateTrip" component={CreateTripScreen} options={{ headerShown: true, title: 'Create Trip' }} />
      <Stack.Screen
        name="TripDetails"
        component={TripTopTabNavigator}
        options={{ headerShown: true, title: 'Trip' }}
      />
      <Stack.Screen name="AddEvent" component={AddEventScreen} options={{ headerShown: true, title: 'Add New Event' }} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ headerShown: true, title: 'Add New Expense' }} />
      <Stack.Screen name="AddMember" component={AddMemberScreen} options={{ headerShown: true, title: 'Add Member' }} />
      <Stack.Screen name="JoinTrip" component={JoinTripScreen} options={{ headerShown: true, title: 'Join Trip' }} />
      <Stack.Screen name="EditTrip" component={EditTripScreen} options={{ headerShown: true, title: 'Edit Trip' }} />
    </Stack.Navigator>
  );
}