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
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("../views/listings/index.ejs", { allListings });
  })
);

//NEW ROUT
router.get("/new", isLoggedIn, (req, res) => {
  res.render("../views/listings/new.ejs");
});

//CREATE ROUT
router.post("/", async (req, res, next) => {
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
    const existingListing = await Listing.findById(req.params.id);

    const listingData = {
      title: req.body.title,
      description: req.body.description,
      image: {
        url: req.body.image, // This assumes you're getting the image URL directly from the form input
        filename: existingListing.image.filename, // Retain the existing filename from the database
      },
      price: req.body.price,
      country: req.body.country,
      location: req.body.location,
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
    const listing = await Listing.findById(id)
      .populate("owner")
      .populate("review")
      .populate({ path: "review", populate: { path: "author" } });

    if (!listing) {
      req.flash("error", "listings you want to acces doesnt exist");
      res.redirect("/listings");
    }
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

//reviews
router.post("/:id/review", isLoggedIn, async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  // console.log("Listing found:", listing);

  let review = new Review(req.body.review);
  // console.log("New review created:", review);

  listing.review.push(review);
  // console.log("Review pushed to listing:", listing);

  await review.save();
  await listing.save();

  res.redirect(`/listings/${req.params.id}`);
});

router.delete(
  "/:id/review/:idreview",
  wrapAsync(async (req, res) => {
    let { id, idreview } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: idreview } }); // understand thsi
    await Review.findByIdAndDelete(idreview);

    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
