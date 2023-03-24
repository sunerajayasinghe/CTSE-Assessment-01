import { Text, View, ScrollView, Pressable, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const Services = () => {
  const navigation = useNavigation();

  const services = [
    {
      id: "0",
      image: "https://cdn-icons-png.flaticon.com/128/3003/3003984.png",
      name: "Washing",
    },
    {
      id: "11",
      image: "https://cdn-icons-png.flaticon.com/512/995/995021.png",
      name: "Dry Cleaning",
    }
  ];

  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 7 }}>
        Services Available
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {services.map((service, index) => (
          <Pressable onPress={() => navigation.navigate(service.name)} style={{ margin: 10, backgroundColor: "white", padding: 20, borderRadius: 7 }} key={index}>
            <Image source={{ uri: service.image }} style={{ width: 70, height: 70 }} />

            <Text style={{ textAlign: "center", marginTop: 10 }}>
              {service.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default Services;
