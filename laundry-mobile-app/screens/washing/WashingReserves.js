import React, { useState } from "react";
import { Alert, Button, FlatList, Pressable, SafeAreaView, Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from "../../firebase";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";

const WashingReserves = () => {
    const [isDateTimePickerVisible, setDateTimePickerVisibility] = useState(false);
    const [washingReserves, setWashingReserves] = useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const getWashingReserves = async () => {
        const q = query(collection(db, "washing-reserves"), where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);

        let tempWashingReserves = [];
        querySnapshot.forEach((doc) => {
            let wr = doc.data();
            wr.id = doc.id;
            tempWashingReserves.push(wr);
        });

        setWashingReserves(tempWashingReserves);
        setIsLoading(false);
        setIsRefreshing(false);
    };

    if (isLoading) {
        getWashingReserves();
    }

    const showWashingReserves = () => {
        return (
            <FlatList
                data={washingReserves}
                refreshing={isRefreshing}
                onRefresh={() => {
                    getWashingReserves();
                    setIsRefreshing(true);
                }}
                renderItem={render}
                keyExtractor={item => item.id} />
        );
    };

    const render = ({ item }) => {
        return (
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 12,
                marginRight: 16,
                marginLeft: 16
            }}>
                <Pressable onPress={() => updateTimeSlot(item.id)} style={{ flex: 1, backgroundColor: '#d6d6ff', padding: 10 }}>
                    <Text>{item.dateTime.slice(0, -17)}</Text>
                </Pressable>

                <Button title="Cancel" color="red" onPress={() => cancelWashingReserveDirectly(item.id)} />
            </View>
        );
    };

    const updateTimeSlot = async (itemId) => {
        await AsyncStorage.setItem("@itemId", itemId);
        showDatePicker();
    };

    const cancelWashingReserveDirectly = async (itemId) => {
        Alert.alert(
            "Are you sure?",
            "You are about to cancel a timeslot reservation.",
            [
                {
                    text: "Cancel",
                    style: 'cancel'
                },
                {
                    text: "OK",
                    onPress: () => cancelWashingReserve(itemId),
                },
            ],
            { cancelable: true }
        );
    };

    const cancelWashingReserve = async (itemId) => {
        await deleteDoc(doc(db, "washing-reserves", itemId));

        getWashingReserves();
        let updatedWashingReserves = [...washingReserves].filter((item) => item.id != itemId);

        setWashingReserves(updatedWashingReserves);
    };

    const showDatePicker = () => {
        setDateTimePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDateTimePickerVisibility(false);
    };

    const reserveWashingPeriod = async (date) => {
        let isTimeValid = true;

        const q = query(collection(db, "washing-reserves"), where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let wr = doc.data();
            const existingDateStart = new Date(wr.dateTime);
            const existingDateEnd = new Date(existingDateStart.getTime() + 60 * 60000);

            if ((date.getTime() <= existingDateEnd.getTime() && date.getTime() >= existingDateStart.getTime())) {
                Alert.alert(
                    "Timeslot already reserved",
                    `Please select a time after ${existingDateEnd}`);
                isTimeValid = false;
                hideDatePicker();
            }
        });

        if (isTimeValid) {
            let washingReserve = {
                dateTime: date.toString(),
                userId: auth.currentUser.uid
            };
            const docRef = await addDoc(collection(db, "washing-reserves"), washingReserve);
            washingReserve.id = docRef.id;

            let tempWashingReserves = [...washingReserves];
            tempWashingReserves.push(washingReserve);

            setWashingReserves(tempWashingReserves);

            Alert.alert(
                "Reserve Success",
                `You have succefully reserved a washing machine at ${date}`);

            hideDatePicker();

            const itemId = await AsyncStorage.getItem("@itemId");
            if (itemId) {
                await cancelWashingReserve(itemId);
                await AsyncStorage.clear();
            }
        }
    };

    return (
        <>
            <SafeAreaView style={{ backgroundColor: "#F0F0F0", marginTop: 40, padding: 25 }}  >
                <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>Reserve a Timeslot (for hour)</Text>
                <Button color='#0000FF' title="Tap Here" onPress={showDatePicker} />
                <DateTimePickerModal
                    isVisible={isDateTimePickerVisible}
                    mode="datetime"
                    onConfirm={reserveWashingPeriod}
                    onCancel={hideDatePicker}
                    minimumDate={new Date()}
                />
                <View>
                    <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10, marginTop: 50 }}>Reserved Timeslots</Text>
                    <Text style={{ fontSize: 12, marginBottom: 10 }}>(Press on a timeslot to update it)</Text>
                    {showWashingReserves()}
                </View>
            </SafeAreaView>
        </>
    );
};

export default WashingReserves;