import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/Home';
import HostStreaming from '../screens/HostStreaming';
import WatchStreaming from '../screens/WatchStreaming';

export default function RootRoute() {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="HostStreaming" component={HostStreaming} />
        <Stack.Screen name="WatchStreaming" component={WatchStreaming} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
