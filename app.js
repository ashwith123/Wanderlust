const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

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

//index rout
app.get("/listings/", async (req, res) => {
  const allLisitngs = await Listing.find({});
  res.render("../views/listings/index.ejs", { allLisitngs });
});

//NEW ROUT
app.get("/listings/new", (req, res) => {
  res.render("../views/listings/new.ejs");
});

//CREATE ROUT
app.post("/listings", async (req, res) => {
  let listing = req.body.listing;
  const newlisting = new Listing(listing);
  await newlisting.save();
  res.redirect("/listings");
});

//UPDATE ROUT
app.get("/lisitngs/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("../views/listings/show.ejs", { listing });
});

//show rout
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("../views/listings/show.ejs", { listing });
});

app.listen(7070, () => {
  console.log("server is listening");
});

// // // this is adding an new list to listing module created in listing.js and reuired here
// app.get("/test", (req, res) => {
//   let samplelist = new Listing({
//     title: "ashre",
//     descrition: "i am good",
//     price: 1200,
//     location: "goa",
//     country: "india",
//   });
//   samplelist.save();
//   console.log("data saved and working ");
//   res.send("sucessfull");
// });
