import React, { useState } from "react";
import { View } from "react-native";

import AddReview from "../components/AddReview";
import ReviewList from "../components/ReviewList";

const ReviewScreen = () => {
  const [reviews, setReviews] = useState([]);

  const handleAddReview = (comment) => {
    const newReview = { id: Date.now().toString(), comment };
    setReviews([newReview, ...reviews]);
  };

  const handleEditReview = (id, newComment) => {
    const updatedReviews = reviews.map((review) => {
      if (review.id === id) {
        return { ...review, comment: newComment };
      }
      return review;
    });
    setReviews(updatedReviews);
  };

  const handleDeleteReview = (id) => {
    const updatedReviews = reviews.filter((review) => review.id !== id);
    setReviews(updatedReviews);
  };

  return (
    <View>
      <AddReview onSubmit={handleAddReview} />
      <ReviewList
        reviews={reviews}
        onEdit={handleEditReview}
        onDelete={handleDeleteReview}
      />
    </View>
  );
};

export default ReviewScreen;
