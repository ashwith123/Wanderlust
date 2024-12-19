const mongoose = require("mongoose");

const schema = mongoose.Schema; // schema required from mongoose

//schema created
const listingschema = new schema({
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
});

// model for schema created
const listing = mongoose.model("listing", listingschema);
module.exports = listing; // module exported
