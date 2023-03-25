import React, { useEffect, useState } from "react";
import { Text, View, Alert, Pressable, Image, ScrollView, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import Carousel from "../components/Carousel";
import Services from "../components/Services";
import ReviewScreen from "./ReviewScreen";
import { auth } from "../firebase";

const HomeScreen = () => {
  const navigation = useNavigation();

  const [displayCurrentAddress, setdisplayCurrentAddress] = useState("Failed to retrieve your location...");
  const [locationServicesEnabled, setlocationServicesEnabled] = useState(false);

  useEffect(() => {
    checkIfLocationEnabled();
    getCurrentLocation();
  }, []);

  const checkIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      Alert.alert(
        "Location services not enabled",
        "Please enable the location services"
      );
    };
    setlocationServicesEnabled(enabled);
  };

  const getCurrentLocation = async () => {
    if (!locationServicesEnabled) {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Allow the app to use the location services",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            { text: "OK" },
          ],
          { cancelable: false }
        );
      }
    }

    const { coords } = await Location.getCurrentPositionAsync();
    if (coords) {
      const { latitude, longitude } = coords;

      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      for (let item of response) {
        let address = `${item.street},\n${item.city}, \n${item.country}.`;
        setdisplayCurrentAddress(address);
      }
    }
  };

  return (
    <>
      <ScrollView style={{ backgroundColor: "#F0F0F0", flex: 1, marginTop: 50 }}  >

        {/* Location and Profile */}
        <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }} >
          <MaterialIcons name="location-on" size={30} color="#fd5c63" />
          <View>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>Home</Text>
            <Text>{displayCurrentAddress}</Text>
          </View>
          <Pressable onPress={() => navigation.navigate("Profile")} style={{ marginLeft: "auto", marginRight: 7 }}>
            <Image
              style={{ width: 40, height: 40, borderRadius: 20 }}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/2767/2767155.png",
              }}
            />
          </Pressable>
        </View>

        {/* Image Carousel */}
        <Carousel />

        {/* Services Component */}
        <Services />

        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>Reviews</Text>
          <ReviewScreen />
        </View>
        <Pressable
          onPress={() => {
            if (auth.currentUser.email === "vihangapramudith0@gmail.com") {
              navigation.navigate("Chat")
            } else {
              navigation.navigate("UserChatInterface")
            }
          }}
          style={{ marginLeft: "auto", marginRight: 20 }}
        >
          <Image
            style={{ width: 40, height: 40, borderRadius: 20 }}
            source={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREUKCdhJI24euYre5ltBbyO7J_8Ecfq8IT0Q&usqp=CAU",
            }}
          />
        </Pressable>
      </ScrollView>
    </>
  );
}

export default HomeScreen;
