//this initially adds data which exists in data.js
//ie it is adding data to Listing which is a model we always add data to model schema is just a bluew print
// listsing.js inside models is creating a model not a schama
// model is where the data is store. data is not stored in array its stored in model so we first insert inital data to it using index.js

//this file is run once nodemon index.js so all data is added is model

const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initdata = require("./data.js");
main()
  .then(() => {
    console.log("connection sucessul");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const InitDB = async () => {
  await Listing.deleteMany({});
  const updateData = initdata.data.map((obj) => ({
    ...obj,
    owner: "67ea7b457bcf3ac46d18f838", // user id
  }));
  await Listing.insertMany(updateData);
  console.log("initial data inserted");
};

InitDB();
