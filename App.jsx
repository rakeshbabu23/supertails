// Only import react-native-gesture-handler on native platforms
import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import {LocationProvider} from './src/context/LocationContext';

const App = () => {
  return (
    <LocationProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </LocationProvider>
  );
};

export default App;
