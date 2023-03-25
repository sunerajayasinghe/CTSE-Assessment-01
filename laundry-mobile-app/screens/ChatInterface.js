import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

function ChatInterface({ route }) {
  const [message, setMessage] = useState("");
  const [getMessages, setMessages] = useState([]);
  const [editMesage, setEditMesage] = useState(false);
  const [id, setId] = useState("");

  console.log();
  useEffect(() => {
    const collectionRef = collection(
      db,
      "users",
      route.params.item.id,
      "messages"
    );
    const q = query(
      collectionRef,
      where("sender", "in", [route.params.item.id, currentUser]),
      orderBy("date")
    );
    const subscriber = onSnapshot(q, {
      next: (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(data);
      },
    });

    return () => subscriber();
  }, []);


  const handleOnChangeText = (text) => {
    setMessage(text);
  };

  const currentUser = getAuth().currentUser.uid;

  const handleOnSendPress = async () => {
    if (message.trim() === "") {
      return; // do not create empty message
    }
    // Handle send button press
    const collectionRef = collection(
      db,
      "users",
      route.params.item.id,
      "messages"
    );
    const doc = await addDoc(collectionRef, {
      message: message,
      sender: currentUser,
      receiver: route.params.item.id,
      date: new Date().toISOString(),
    });
    setMessage("");
    return;
  };

  const handleOnEditPress = async () => {
    const messageonRef = doc(db, "users", route.params.item.id, "messages", id);
    await updateDoc(messageonRef, { message: message });
    setMessage("");
    setEditMesage(false);
    setId("");
  };

  const deleteMessage = async (id) => {
    const ref = doc(db, "users", route.params.item.id, "messages", id);
    await deleteDoc(ref);
  };

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 20,
          height: 60,
          width: "80%",
          padding: 10,
          marginVertical: 4,
          backgroundColor: item.sender == currentUser ?  "#8536c9" : "white",
          alignSelf: item.sender == currentUser ? "flex-end" : "flex-start",
        }}
      >
        <MenuProvider skipInstanceCheck={true}>
          <Menu onSelect={(value) => alert(`Selected number: ${value}`)}>
            <MenuTrigger
            disabled={item.sender == currentUser ? false : true}
              text={
                <View>
                <Text
                  style={{
                    fontSize: 22,
                  }}
                >
                  {String(item.message)}
                  
                </Text>
                </View>
              }
            />
            <MenuOptions
              optionsContainerStyle={{
                borderRadius: 20,
                width: 100,
              }}
            >
              <MenuOption
                style={{ justifyContent: "center", alignItems: "center"}}
                value={1}
                onSelect={() => {
                  setEditMesage(true);
                  setMessage(item.message);
                  setId(item.id);
                }}
              />
              <Text
                style={{
                  alignSelf: "center",
                  color: "#395d6b",
                  marginTop: -10,
                }}
              >
                Edit
              </Text>
              <MenuOption value={2} onSelect={() => deleteMessage(item.id)} />
              <Text
                style={{ alignSelf: "center", color: "red", marginTop: -10 }}
              >
                Delete
              </Text>
            </MenuOptions>
          </Menu>
        </MenuProvider>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <View>
      <View style={styles.header}>
        <Text style={styles.title}>{route.params.item.email}</Text>
      </View>
        {getMessages.length > 0 && (
          <View>
            <FlatList
              data={getMessages}
              contentContainerStyle={{ paddingVertical: 20 }}
              renderItem={renderItem}
              keyExtractor={(message) => message.id}
            />
          </View>
        )}
        <View>
          {editMesage ? (
            <View>
              <TextInput
                style={{
                  marginTop: 100,
                  marginLeft: 10,
                  height: 40,
                  width: 350,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  paddingHorizontal: 10,
                }}
                placeholder="Type your message here..."
                value={message}
                onChangeText={handleOnChangeText}
                multiline={true}
                autoFocus={true}
              />
              <TouchableOpacity
                disabled={!message.length}
                onPress={handleOnEditPress}
              >
                <MaterialIcons
                  name="send"
                  size={35}
                  color="#348feb"
                  style={{ marginTop: -37, marginLeft: 370 }}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <TextInput
                style={{
                  marginTop: 100,
                  marginLeft: 10,
                  height: 40,
                  width: 350,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  paddingHorizontal: 10,
                }}
                placeholder="Type your message here..."
                value={message}
                onChangeText={handleOnChangeText}
                multiline={true}
                autoFocus={true}
              />
              <TouchableOpacity
                disabled={!message.length}
                onPress={handleOnSendPress}
              >
                <MaterialIcons
                  name="send"
                  size={35}
                  color="#348feb"
                  style={{ marginTop: -37, marginLeft: 370 }}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
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
  form: {
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  todoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    marginVertical: 4,
  },
  todoText: {
    flex: 1,
    paddingHorizontal: 4,
  },
  todo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ChatInterface;
