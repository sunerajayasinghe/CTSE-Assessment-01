import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Image,
  StyleSheet,
  TextInput,
  Button,
} from "react-native";
import DressItem from "../components/DressItem";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../ProductReducer";
import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
//
const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#fff",
    padding: 20,
    width: 300,
  },
  orders: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
  },
  pickupDetails: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  textInput: {
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  button: {
    marginLeft: 10,
  },
});
//
const DryCleaningScreen = () => {
  const cart = useSelector((state) => state.cart.cart);
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newText, setNewText] = useState("");
  //
  const total = cart
    .map((item) => item.quantity * item.price)
    .reduce((curr, prev) => curr + prev, 0);
  //
  const product = useSelector((state) => state.product.product);
  const dispatch = useDispatch();
  //
  useEffect(() => {
    if (product.length > 0) return;

    const fetchProducts = async () => {
      //get data from firebase
      const colRef = collection(db, "types");
      const docsSnap = await getDocs(colRef);
      docsSnap.forEach((doc) => {
        items.push(doc.data());
      });
      items?.map((service) => dispatch(getProducts(service)));
    };
    fetchProducts();
  }, []);
  //
  const loadOrders = async () => {
    const orderRef = collection(db, "orders");
    const orderSnapshot = await getDocs(orderRef);
    const orderList = orderSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setOrders(orderList);
  };
  //
  useEffect(() => {
    loadOrders();
  }, []);
  //
  const deleteOrder = async (id) => {
    try {
      const orderRef = doc(db, "orders", id);
      await deleteDoc(orderRef);
      alert("Orders deleted");
      loadOrders();
    } catch (error) {
      console.error("Error deleting order: ", error);
    }
  };
  //
  const handleSubmit = (id) => {
    if (newText !== "") {
      updateOrder(id, newText);
      setNewText("");
      setIsModalVisible(false);
    }
  };
  //
  const updateOrder = async (id, newText) => {
    try {
      const orderRef = doc(db, "orders", id);
      await updateDoc(orderRef, { "orders.0.quantity": newText });
      loadOrders();
    } catch (error) {
      console.error("Error updating review: ", error);
    }
  };
  return (
    <>
      <ScrollView style={{ backgroundColor: "#F0F0F0", flex: 1, marginTop: 5 }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 25, color: "black", fontWeight: "bold" }}>
            Receive Your Time
          </Text>
        </View>

        {/* Render all the Products */}
        {product.map((item, index) => (
          <DressItem item={item} key={index} />
        ))}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontSize: 25,
              color: "black",
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            My Orders
          </Text>
          {orders?.map((order, index) => {
            const { orders, pickUpDetails } = order;
            return (
              <View style={styles.container} key={index}>
                <View style={styles.orders}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      marginTop: 1,
                      marginBottom: 30,
                    }}
                  >
                    <MaterialIcons
                      name="delete"
                      size={24}
                      color="red"
                      style={{ marginRight: 10 }}
                      onPress={() => {
                        deleteOrder(order.id);
                      }}
                    />
                    <MaterialIcons
                      name="edit"
                      size={24}
                      color="green"
                      onPress={() => setIsModalVisible(true)}
                    />
                  </View>
                  <Modal isVisible={isModalVisible}>
                    <View style={styles.modalContent}>
                      <TextInput
                        placeholder="Enter new quantity..."
                        value={newText}
                        onChangeText={(text) => setNewText(text)}
                        keyboardType="numeric"
                        style={styles.textInput}
                      />
                      <View style={styles.buttonContainer}>
                        <Button
                          title="Cancel"
                          onPress={() => setIsModalVisible(false)}
                          color="#999999"
                          style={styles.button}
                        />
                        <Button
                          title="Submit"
                          onPress={() => {
                            handleSubmit(order.id);
                          }}
                          color="#007AFF"
                          style={styles.button}
                        />
                      </View>
                    </View>
                  </Modal>
                  {Object?.values(orders)?.map((order) => (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <Image
                        style={{ width: 50, height: 50 }}
                        source={{ uri: order?.image }}
                      />
                      <Text
                        key={order.id}
                        style={{
                          marginLeft: 10,
                        }}
                      >
                        Order ID: {order.id} {"\n"}- {order.name}:{" "}
                        {order.quantity} x {order.price} ={" "}
                        {order.quantity * order.price} {"\n"}
                      </Text>
                    </View>
                  ))}
                  <Text style={styles.pickupDetails}>
                    {"\n"}
                    Pick Up Details:
                  </Text>
                  <Text style={{ marginLeft: 12 }}>
                    {"\n"}📆 No. of days: {pickUpDetails.no_Of_days}
                    {"\n"}
                    {"\n"}⌚ Selected Time: {pickUpDetails.selectedTime}
                    {"\n"}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      {total === 0 ? null : (
        <Pressable
          style={{
            backgroundColor: "#088F8F",
            padding: 10,
            marginBottom: 40,
            margin: 15,
            borderRadius: 7,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ fontSize: 17, fontWeight: "600", color: "white" }}>
              {cart.length} items | Rs {total}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "400",
                color: "white",
                marginVertical: 6,
              }}
            >
              extra charges might apply
            </Text>
          </View>

          <Pressable onPress={() => navigation.navigate("PickUp")}>
            <Text style={{ fontSize: 17, fontWeight: "600", color: "white" }}>
              Proceed to pickup
            </Text>
          </Pressable>
        </Pressable>
      )}
    </>
  );
};

export default DryCleaningScreen;
