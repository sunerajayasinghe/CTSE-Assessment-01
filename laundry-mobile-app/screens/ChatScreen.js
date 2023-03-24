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
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView>
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat User List</Text>
      </View>
      <View style={{ backgroundColor: "#3275a8" }}>
        {users.length > 0 && (
          <View>
            <FlatList
              data={users}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        )}
      </View>
      </View>
    </SafeAreaView>
  );
}

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#151617"',
  },
  header: {
    backgroundColor: '#fff',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: "#27b2f2",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 20,
  },
});
