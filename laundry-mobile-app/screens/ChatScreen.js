import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebase";
import { FontAwesome } from "@expo/vector-icons";

function ChatScreen() {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const userRef = collection(db, "users");

    const subscriber = onSnapshot(userRef, {
      next: (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(data);
      },
    });

    return () => subscriber();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() => navigation.navigate("ChatInterface", { item })}
      >
        <View style={{ flexDirection: "row" }}>
          <FontAwesome name="user-circle" size={24} color="black" />
          <Text style={{ fontSize: 18, fontWeight: "bold", paddingLeft: 10 }}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#dfede3" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Chat User List</Text>
        </View>
        <View
          style={{
            backgroundColor: "#3275a8",
          }}
        >
          {users.length > 0 && (
            <FlatList
              data={users}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#32a852",
  },
  header: {
    backgroundColor: "#fff",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  item: {
    backgroundColor: "#27b2f2",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 20,
  },
});
