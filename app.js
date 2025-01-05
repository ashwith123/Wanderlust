const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "public")));

// checks if connection is successful
main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

// Connecting mongoose
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.get("/", (req, res) => {
  res.send("hi this is project's Root");
});

// Index route
app.get("/listings/", async (req, res, next) => {
  try {
    const allListings = await Listing.find({});
    res.render("../views/listings/index.ejs", { allListings });
    //console.log(allListings);
  } catch (error) {
    next(error); // Pass the error to the next middleware (error handler)
  }
});

// New route
app.get("/listings/new", (req, res) => {
  res.render("../views/listings/new.ejs");
});

<<<<<<< HEAD
// Create route
app.post("/listings", async (req, res, next) => {
  try {
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
  } catch (error) {
    next(error); // Pass the error to the next middleware
=======
//CREATE ROUT
app.post("/listings", async (req, res, next) => {
  try {
    let listing = req.body.listing;
    const newlisting = new Listing(listing);
    await newlisting.save();
    res.redirect("/listings");
  } catch (err) {
    next(err);
>>>>>>> main
  }
});

// Edit route
app.get("/listings/:id/edit", async (req, res, next) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("../views/listings/edit.ejs", { listing });
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
});

<<<<<<< HEAD
// Update route
app.put("/listings/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    res.redirect(`/listings/${id}`);
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
});

// Show route
app.get("/listings/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("../views/listings/show.ejs", { listing });
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
=======
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
>>>>>>> main
});

// Delete route
app.delete("/listings/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).send("Listing not found");
    }

    console.log(`Deleted listing: ${deletedListing}`);
    res.redirect("/listings");
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).render("error", { error: err }); // Render error.ejs with the error details
});

app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
