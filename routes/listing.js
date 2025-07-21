const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const listingSchema = require("../schema");
const Review = require("../models/reviews");
const { isLoggedIn } = require("../middleware");

//index rout
router.get(
  "/",
  isLoggedIn,

  wrapAsync(async (req, res) => {
    console.log("user is logged in" + isLoggedIn);
    const allListings = await Listing.find({});
    res.render("../views/listings/index.ejs", { allListings });
  })
);

//NEW ROUT
router.get("/new", isLoggedIn, (req, res) => {
  res.render("../views/listings/new.ejs");
});

//CREATE ROUT
router.post("/new", isLoggedIn, async (req, res, next) => {
  try {
    let result = listingSchema.validate(req.body); //joi for server side validation
    if (result.error) {
      //if error exist in server side
      throw new expressError(404, result.error);
    }
    let listing = req.body.listing;
    const newlisting = new Listing(listing);
    newlisting.owner = req.user._id; //adds username and mail to owner
    await newlisting.save();
    req.flash("success", "new listings created");
    res.redirect("/listings");
  } catch (e) {
    console.log(e);
  }
});

//EDIT ROUT
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    res.render("../views/listings/edit.ejs", { listing });
  })
);

//UPDATE ROUT
router.put(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    console.log("new data=", req.body);
    const listingData = {
      title: req.body.listing.title,
      description: req.body.listing.description,
      image: req.body.listing.image, // This assumes you're getting the image URL directly from the form input
      price: req.body.listing.price,
      country: req.body.listing.country,
      location: req.body.listing.location,
    };

    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...listingData });
    req.flash("success", "new listings created");

    res.redirect(`/listings/${id}`);
  })
);

//show rout
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    // Populate owner and reviews with their respective authors
    const listing = await Listing.findById(id)
      .populate("owner") // Populate the owner field
      .populate({
        path: "reviews", // Populate reviews
        populate: {
          path: "author", // Populate the author field inside each review
        },
      });

    if (!listing) {
      req.flash("error", "The listing you're looking for does not exist");
      return res.redirect("/listings");
    }

    console.log("Listing reviews:", listing.reviews); // For debugging
    res.render("../views/listings/show.ejs", { listing });
  })
);

//DELETE LISTING WITH HANDLING CASE IF LISTING DOESNT EXIST
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    try {
      const { id } = req.params;
      const deletedListing = await Listing.findByIdAndDelete(id);

      if (!deletedListing) {
        req.flash("error", "listing not found");
        res.redirect("/listings");
      }

      console.log(`Deleted listing: ${deletedListing}`);
      req.flash("success", " listings deleted successfully");

      res.redirect("/listings"); // Ensure this path exists in your router
    } catch (error) {
      console.error("Error deleting listing:", error);
      res.status(500).send("Server error");
    }
  })
);

module.exports = router;
