const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  comment: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const review = mongoose.model("Review", reviewSchema);

module.exports = review;
