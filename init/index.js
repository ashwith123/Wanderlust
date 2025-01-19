//this initially adds data which exists in data.js 
//ie it is adding data to Listing which is a model we always add data to model schema is just a bluew print

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

async function adding() {
  await Listing.deleteMany({});
  await Listing.insertMany(initdata.data);
  console.log("initial data inserted");
}

adding();
