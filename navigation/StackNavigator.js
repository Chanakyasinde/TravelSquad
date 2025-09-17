import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import MyTrips from '../components/MyTrips';
import Itinerary from '../components/Itinerary';
import Expenses from '../components/Expenses';
import Chat from '../components/Chat';
import Profile from '../components/Profile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'MyTrips') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Itinerary') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Expenses') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="MyTrips" component={MyTrips} options={{ title: 'My Trips' }} />
      <Tab.Screen name="Itinerary" component={Itinerary} />
      <Tab.Screen name="Expenses" component={Expenses} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
    </Stack.Navigator>
  );
}
