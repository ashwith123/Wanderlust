const { number, string } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Define the listings schema
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId, // gives unique id for each review
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// model for schema created
const listing = mongoose.model("listing", listingSchema);
module.exports = listing; // module exported
