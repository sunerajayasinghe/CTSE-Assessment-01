import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
} from "react-native";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Modal from "react-native-modal";
import { MaterialIcons } from "@expo/vector-icons";

const ReviewScreen = () => {
  //adding state variables
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newText, setNewText] = useState("");

  //load reviews form firebase
  const loadReviews = async () => {
    const reviewsRef = collection(db, "reviews");
    const reviewsSnapshot = await getDocs(reviewsRef);
    const reviewsList = reviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setReviews(reviewsList);
  };

  //
  useEffect(() => {
    loadReviews();
  }, []);

  //add a new review to firebase
  const addReview = async () => {
    try {
      const reviewsRef = collection(db, "reviews");
      await addDoc(reviewsRef, { text: review });
      setReview("");
      loadReviews();
    } catch (error) {
      console.error("Error adding review: ", error);
    }
  };
  //handling the review submission
  const handleSubmit = (id) => {
    if (newText !== "") {
      updateReview(id, newText);
      setNewText("");
      setIsModalVisible(false);
    }
  };
  //update a review
  const updateReview = async (id, newText) => {
    try {
      const reviewRef = doc(db, "reviews", id);
      await updateDoc(reviewRef, { text: newText });
      loadReviews();
    } catch (error) {
      console.error("Error updating review: ", error);
    }
  };
  //delete review recored from firebase
  const deleteReview = async (id) => {
    try {
      const reviewRef = doc(db, "reviews", id);
      await deleteDoc(reviewRef);
      loadReviews();
      alert("review deleted successfully");
    } catch (error) {
      console.error("Error deleting review: ", error);
    }
  };

  //render review component
  const renderReview = ({ item }) => {
    return (
      <View style={styles.review}>
        <Text style={styles.reviewText}>{item.text}</Text>
        <View style={styles.buttonsContainer}>
          <Modal isVisible={isModalVisible}>
            <View style={styles.modalContent}>
              <TextInput
                placeholder="Enter new review..."
                value={newText}
                onChangeText={(text) => setNewText(text)}
                keyboardType="default"
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
                    handleSubmit(item.id);
                  }}
                  color="#007AFF"
                  style={styles.button}
                />
              </View>
            </View>
          </Modal>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 10,
              marginLeft: 250,
            }}
          >
            <MaterialIcons
              name="edit"
              size={24}
              color="green"
              onPress={() => setIsModalVisible(true)}
            />
            <MaterialIcons
              name="delete"
              size={24}
              color="red"
              style={{ marginRight: 10 }}
              onPress={() => {
                deleteReview(item.id);
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={review}
        onChangeText={(text) => setReview(text)}
        placeholder="Enter a review"
      />
      <Button title="Add" onPress={addReview} color="#007AFF" />
      <Text style={{ marginTop: 20, fontSize: 20 }}>My Reviews🖋️</Text>
      <FlatList
        style={styles.reviewsList}
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  reviewsList: {
    marginTop: 20,
  },
  review: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  reviewText: {
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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

export default ReviewScreen;
