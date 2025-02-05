const express = require("express");
const router = express.Router();
const Review = require("../models/reviews");
const Listing = require("../models/listing");
const wrapAsyn = require("../utils/wrapAsyn");

//reviews

router.post("/listings/<%=listing._id%>/review", async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  Listing.review.push(newReview);

  await newReview.save(); //cr
  await listing.save();
});

//delete review
router.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsyn(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
