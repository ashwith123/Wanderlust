const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");

// checks if connection is successfull main is name of function in which connection is being given

main()
  .then(() => {
    console.log("connection sucessul");
  })
  .catch((err) => {
    console.log(err);
  });

//connecting mongoose
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.get("/", (req, res) => {
  res.send("hi this is projects Root");
});

// // this is adding an new list to listing module created in listing.js and reuired here
app.get("/test", (req, res) => {
  let samplelist = new Listing({
    title: "ashre",
    descrition: "i am good",
    price: 1200,
    location: "goa",
    country: "india",
  });
  samplelist.save();
  console.log("data saved and working ");
  res.send("sucessfull");
});

app.listen(7070, () => {
  console.log("server is listening");
});
