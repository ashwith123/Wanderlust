const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/reviews");
const Listing = require("../models/listing");
const wrapAsyn = require("../utils/wrapAsync");

//reviews

router.post("/", async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review({ ...req.body.review, author: req.user._id });
    newReview.author = req.user._id;
    await newReview.save(); //cr

    listing.reviews.push(newReview._id);

    await listing.save();
    req.flash("success", "Review added successfully");
    res.redirect(`/listings/${listing._id}`);
  } catch (e) {
    console.log("error" + e);
    next(e);
  }
});

//delete review
router.delete(
  "/:reviewId",
  wrapAsyn(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
