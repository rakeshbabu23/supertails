import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/Home';
import Address from '../screens/Address';
import ManualAddress from '../screens/ManualAddress';
import MapScreen from '../screens/MapScreen';
import ConfirmLocation from '../screens/ConfirmLocation';
import AddressManagement from '../screens/AddressManagement';
import AddNewAddress from '../screens/AddNewAddress';

const Stack = createStackNavigator();
const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Address" component={Address} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="ManualAddress" component={ManualAddress} />
      <Stack.Screen name="ConfirmLocation" component={ConfirmLocation} />
      <Stack.Screen name="AddressManagement" component={AddressManagement} />
      <Stack.Screen name="AddNewAddress" component={AddNewAddress} />
    </Stack.Navigator>
  ); 
};

export default AppNavigator;
