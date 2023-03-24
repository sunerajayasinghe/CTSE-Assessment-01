import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

const AddReview = ({ onSubmit }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onSubmit(comment);
    setComment("");
  };

  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 15, fontWeight: "300" }}>Add a review</Text>
      <View
        style={{
          padding: 20,
          margin: 5,
          backgroundColor: "white",
          borderColor: "red",
          borderRadius: 10,
        }}
      >
        <TextInput
          placeholder="Write a comment"
          onChangeText={setComment}
          value={comment}
        />
      </View>

      <View style={{ padding: 20 }}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </View>
  );
};

export default AddReview;
