import React from "react";
import { View, Text, FlatList, Button } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const ReviewList = ({ reviews, onEdit, onDelete }) => {
  const renderItem = ({ item }) => (
    <View
      style={{
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        marginTop: 6,
      }}
    >
      <Text>{item.comment}</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <AntDesign
          name="edit"
          size={20}
          color="green"
          onPress={() => onEdit(item.id, "New comment")}
          style={{ paddingRight: 15 }}
        />
        <AntDesign
          name="delete"
          size={20}
          color="red"
          onPress={() => onDelete(item.id)}
        />
      </View>
    </View>
  );

  return (
    <View style={{ padding: 10 }}>
      <FlatList
        data={reviews}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ReviewList;
