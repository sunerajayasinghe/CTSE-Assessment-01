import { Text, SafeAreaView, Pressable } from 'react-native'
import React from 'react'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const SignOutScreen = () => {
  const navigation = useNavigation();

  const signOutUser = () => {
    signOut(auth).then(() => {
      navigation.replace("Login");
    }).catch(err => {
      console.log(err.message);
    });
  };

  const navigateBack = () => {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Pressable style={{ marginVertical: 10 }}>
        <Text>Are you sure?</Text>
      </Pressable>
      <Text>{'\n'}</Text>

      <Pressable onPress={signOutUser}>
        <Text>Yes</Text>
      </Pressable>
      <Text>{'\n'}</Text>
      <Pressable onPress={navigateBack}>
        <Text>No</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default SignOutScreen;
