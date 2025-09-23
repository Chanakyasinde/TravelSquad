import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/StackNavigator'; 
import { TripProvider } from './contexts/TripContext'; 

export default function App() {
  return (
    <TripProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </TripProvider>
  );
}