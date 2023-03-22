import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  Pressable,
} from "react-native";
import DressItem from "../components/DressItem";
import { Calendar, LocaleConfig } from "react-native-calendars";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../ProductReducer";

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

LocaleConfig.locales["en"] = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

LocaleConfig.defaultLocale = "en";

const DryCleaningScreen = () => {
  const cart = useSelector((state) => state.cart.cart);
  // console.log(cart);
  const [selectedDate, setSelectedDate] = useState("");
  const [isPickerVisible, setPickerVisibility] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  //
  const product = useSelector((state) => state.product.product);
  console.log(product);
  const dispatch = useDispatch();
  //
  useEffect(() => {
    if (product.length > 0) return;

    const fetchProducts = async () => {
      // const colRef = collection(db, "types");
      // const docsSnap = await getDocs(colRef);
      // docsSnap.forEach((doc) => {
      //   items.push(doc.data());
      // });
      services?.map((service) => dispatch(getProducts(service)));
    };
    fetchProducts();
  }, []);

  //
  const showPicker = () => {
    setPickerVisibility(true);
  };
  //
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  //
  const hidePicker = () => {
    setPickerVisibility(false);
  };
  //
  const handleConfirm = (time) => {
    setSelectedTime(time);
    hidePicker();
  };
  //
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
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

      <View
        style={{
          padding: 30,
          marginTop: 0,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            color: "#808080",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 15,
          }}
        >
          Select a date & Time
        </Text>
        {/* ///////////// */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Pressable onPress={showDatePicker} style={{ width: 100 }}>
            <Text
              style={{
                borderColor: "gray",
                borderRadius: 4,
                borderWidth: 0.8,
                marginVertical: 10,
                color: "black",
                textAlign: "center",
                padding: 5,
                fontSize: 17,
                fontWeight: "bold",
              }}
            >
              Select Date
            </Text>
          </Pressable>
          <Pressable onPress={showPicker} style={{ width: 110 }}>
            <Text
              style={{
                borderColor: "gray",
                borderRadius: 4,
                borderWidth: 0.8,
                marginVertical: 10,
                color: "black",
                textAlign: "center",
                padding: 5,
                fontSize: 17,
                fontWeight: "bold",
              }}
            >
              Select Time
            </Text>
          </Pressable>
        </View>

        <Modal
          visible={isDatePickerVisible}
          animationType="slide"
          transparent={true}
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "red",
          }}
        >
          <View style={{ backgroundColor: "#fff", padding: 20 }}>
            <TouchableOpacity onPress={() => setDatePickerVisibility(false)}>
              <Text style={{ alignSelf: "flex-end", marginBottom: 10 }}>
                Close
              </Text>
            </TouchableOpacity>
            <Calendar
              onDayPress={onDayPress}
              markedDates={{
                [selectedDate]: { selected: true },
              }}
              theme={{
                calendarBackground: "#ffffff",
                todayTextColor: "#007aff",
                dayTextColor: "#2d4150",
                textDisabledColor: "#d9e1e8",
                selectedDayTextColor: "#ffffff",
                selectedDayBackgroundColor: "#007aff",
                dotColor: "#007aff",
                selectedDotColor: "#ffffff",
                arrowColor: "#007aff",
                monthTextColor: "#007aff",
                textSectionTitleColor: "#007aff",
              }}
            />
          </View>
        </Modal>
        <DateTimePickerModal
          isVisible={isPickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          onCancel={hidePicker}
        />
      </View>
      <Text
        style={{
          fontSize: 15,
          color: "#808080",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 15,
        }}
      >
        Add to Bucket
      </Text>
      {/* Render all the Products */}
      {product.map((item, index) => (
        <DressItem item={item} key={index} />
      ))}
    </ScrollView>
  );
};

export default DryCleaningScreen;
