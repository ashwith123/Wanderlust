const express = require("express");
const router = express.Router();
const Review = require("../models/reviews");
const Listing = require("../models/listing");

//reviews

router.post("/listings/<%=listing._id%>/review", async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  Listing.review.push(newReview);

  await newReview.save(); //cr
  await listing.save();
});

module.exports = router;
