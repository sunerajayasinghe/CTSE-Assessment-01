import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import DressItem from "../components/DressItem";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../ProductReducer";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
const services = [
  {
    id: "0",
    image: "https://cdn-icons-png.flaticon.com/128/4643/4643574.png",
    name: "shirt",
    quantity: 0,
    price: 10,
  },
  {
    id: "11",
    image: "https://cdn-icons-png.flaticon.com/512/5638/5638937.png",
    name: "Saree",
    quantity: 0,
    price: 10,
  },
  {
    id: "12",
    image: "https://cdn-icons-png.flaticon.com/128/9609/9609161.png",
    name: "dresses",
    quantity: 0,
    price: 10,
  },
  {
    id: "13",
    image: "https://cdn-icons-png.flaticon.com/128/599/599388.png",
    name: "jeans",
    quantity: 0,
    price: 10,
  },
  {
    id: "14",
    image: "https://cdn-icons-png.flaticon.com/128/9431/9431166.png",
    name: "Sweater",
    quantity: 0,
    price: 10,
  },
];

const DryCleaningScreen = () => {
  const cart = useSelector((state) => state.cart.cart);
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
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
