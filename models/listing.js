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
    filename: String,
    url: String,
  },
  price: Number,
  location: String,
  country: String,

  review: [
    {
      type: Schema.Types.ObjectId, // gives unique id for each review
      ref: "review",
    },
  ],
});

// model for schema created
const listing = mongoose.model("listing", listingSchema);
module.exports = listing; // module exported
