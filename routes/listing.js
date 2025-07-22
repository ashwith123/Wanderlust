const express = require("express");
const multer = require("multer");
const { storage } = require("../lib/cloudinary");
const upload = multer({ storage });
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
    const allListings = await Listing.find({});
    console.log("all lisitngs sent to index page is ", allListings);
    res.render("../views/listings/index.ejs", { allListings });
  })
);

//NEW ROUT
router.get("/new", isLoggedIn, (req, res) => {
  res.render("../views/listings/new.ejs");
});

//CREATE ROUT
router.post(
  "/new",
  isLoggedIn,
  upload.single("listing[image]"),
  async (req, res, next) => {
    try {
      const newlist = { ...req.body.listing };

      if (req.file) {
        newlist.image = {
          url: req.file.path,
          filename: req.file.filename,
        };
      } else {
        // If not uploaded, DELETE the image key
        delete newlist.image;
      }

      const result = listingSchema.validate({ listing: newlist });
      if (result.error) {
        console.log(result.error);
        throw new expressError(400, result.error.details[0].message);
      }

      const newlisting = new Listing(newlist);
      newlisting.owner = req.user._id;

      await newlisting.save();
      const find = Listing.findById();
      console.log(newlist);
      req.flash("success", "New listing created!");
      res.redirect("/listings");
    } catch (e) {
      next(e);
    }
  }
);

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
      const listing = await Listing.findById(id);

      if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
      }
      if (listing.image && listing.image.filename) {
        try {
          await cloudinary.uploader.destroy(listing.image.filename); // delete from Cloudinar
          console.log(
            `Deleted image from Cloudinary: ${listing.image.filename}`
          );
        } catch (cloudErr) {
          console.error("Cloudinary delete failed:", cloudErr);
          req.flash("error", "Image deletion failed");
          return res.redirect("/listings");
        }
      }
      await Listing.findByIdAndDelete(id);
      req.flash("success", "Listing and image deleted successfully");
      res.redirect("/listings");
    } catch (error) {
      console.error("Error deleting listing:", error);
      res.status(500).send("Server error");
    }
  })
);

module.exports = router;
