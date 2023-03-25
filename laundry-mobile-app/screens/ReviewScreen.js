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

const ReviewScreen = () => {
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newText, setNewText] = useState("");

  const loadReviews = async () => {
    const reviewsRef = collection(db, "reviews");
    const reviewsSnapshot = await getDocs(reviewsRef);
    const reviewsList = reviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setReviews(reviewsList);
  };

  useEffect(() => {
    loadReviews();
  }, []);

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
  //
  const handleSubmit = (id) => {
    console.log(id);
    if (newText !== "") {
      updateReview(id, newText);
      setNewText("");
      setIsModalVisible(false);
    }
  };
  //
  const updateReview = async (id, newText) => {
    try {
      const reviewRef = doc(db, "reviews", id);
      await updateDoc(reviewRef, { text: newText });
      loadReviews();
    } catch (error) {
      console.error("Error updating review: ", error);
    }
  };
  //
  const deleteReview = async (id) => {
    try {
      const reviewRef = doc(db, "reviews", id);
      await deleteDoc(reviewRef);
      loadReviews();
    } catch (error) {
      console.error("Error deleting review: ", error);
    }
  };

  const renderReview = ({ item }) => {
    return (
      <View style={styles.review}>
        <Text style={styles.reviewText}>{item.text}</Text>
        <View style={styles.buttonsContainer}>
          <Button title="Edit" onPress={() => setIsModalVisible(true)} />
          <Modal isVisible={isModalVisible}>
            <View style={styles.modalContent}>
              <TextInput
                placeholder="Enter new text..."
                value={newText}
                onChangeText={(text) => setNewText(text)}
                keyboardType="default"
              />
              <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
              <Button
                title="Submit"
                onPress={() => {
                  handleSubmit(item.id);
                }}
              />
            </View>
          </Modal>
          <Button
            title="Delete"
            onPress={() => {
              deleteReview(item.id);
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviews</Text>
      <TextInput
        style={styles.input}
        value={review}
        onChangeText={(text) => setReview(text)}
        placeholder="Enter a review"
      />
      <Button title="Add" onPress={addReview} />
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  review: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 18,
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    // alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
    margin: 15,
  },
});

export default ReviewScreen;
