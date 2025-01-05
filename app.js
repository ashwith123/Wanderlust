const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Make sure views folder is set correctly
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "public")));

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
  const allListings = await Listing.find({});
  res.render("../views/listings/index.ejs", { allListings });
  console.log(allListings);
});

//NEW ROUT
app.get("/listings/new", (req, res) => {
  res.render("../views/listings/new.ejs");
});

//CREATE ROUT
app.post("/listings", async (req, res, next) => {
  try {
    let listing = req.body.listing;
    const newlisting = new Listing(listing);
    await newlisting.save();
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
});

//EDIT ROUT
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("../views/listings/edit.ejs", { listing });
});

//UPDATE ROUT
app.put("/listings/:id", async (err, next, req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect("/listings/${id}");
});

app.use((next, err, res, req) => {
  res.send("there is some mistake");
});

//show rout
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("../views/listings/show.ejs", { listing });
});

//DELETE LISTING WITH HANDLING CASE IF LISTING DOESNT EXIST
app.delete("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).send("Listing not found");
    }

    console.log(`Deleted listing: ${deletedListing}`);
    res.redirect("/listings"); // Ensure this path exists in your app
  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).send("Server error");
  }
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
