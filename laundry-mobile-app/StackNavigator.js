import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SignOutScreen from './screens/SignOut';
import WashingReserves from './screens/washing/WashingReserves';
import DryCleaningScreen from "./screens/DryCleaningScreen";
import PickUpScreen from "./screens/PickUpScreen";
import CartScreen from "./screens/CartScreen";
import OrderScreen from "./screens/OderScreen";
import ChatScreen from './screens/ChatScreen';
import ChatInterface from './screens/ChatInterface';
import UserChatInterface from './screens/UserChatInterface';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={SignOutScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Washing" component={WashingReserves} options={{ headerShown: false }} />
        <Stack.Screen name="Dry Cleaning" component={DryCleaningScreen} options={{ headerShown: true }} />
        <Stack.Screen name="PickUp" component={PickUpScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Order" component={OrderScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChatInterface" component={ChatInterface} options={{ headerShown: false }} />
        <Stack.Screen name="UserChatInterface" component={UserChatInterface} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
