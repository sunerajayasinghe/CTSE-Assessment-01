import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import DryCleaningScreen from "./screens/DryCleaningScreen";
import ChatScreen from './screens/ChatScreen';
import ChatInterface from './screens/ChatInterface';
import UserChatInterface from './screens/UserChatInterface';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DryClean"
          component={DryCleaningScreen}
          // options={{ headerShown: false }}
        />
        <Stack.Screen name="Chat" component={ChatScreen} options={{headerShown:false}}/>
        <Stack.Screen name="ChatInterface" component={ChatInterface} options={{headerShown:false}}/>
        <Stack.Screen name="UserChatInterface" component={UserChatInterface} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
