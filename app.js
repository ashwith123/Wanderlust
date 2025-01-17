const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsyn");
const expressError = require("./utils/expressError");
const listingSchema = require("./schema");
const Review = require("./models/reviews");

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
app.get(
  "/listings/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("../views/listings/index.ejs", { allListings });
  })
);

//NEW ROUT
app.get("/listings/new", (req, res) => {
  res.render("../views/listings/new.ejs");
});

//CREATE ROUT
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    let result = listingSchema.validate(req.body); //joi for server side validation
    if (result.error) {
      //if error exist in server side
      throw new expressError(404, result.error);
    }
    let listing = req.body.listing;
    const newlisting = new Listing(listing);
    await newlisting.save();
    res.redirect("/listings");
  })
);

//EDIT ROUT
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("../views/listings/edit.ejs", { listing });
  })
);

//UPDATE ROUT
app.put(
  "/listings/:id",
  wrapAsync(async (err, next, req, res) => {
    if (!req.body.listing) {
      throw new expressError(400, "send valid data");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings/${id}");
  })
);

//show rout
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("../views/listings/show.ejs", { listing });
  })
);

//DELETE LISTING WITH HANDLING CASE IF LISTING DOESNT EXIST
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
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
  })
);

//reviews
app.post("/listings/:id/review", async (req, res) => {
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

app.all("*", (req, res, next) => {
  //handels request routs that doesnt exist other errors are handeled by the below middleware
  next(new expressError("page not found", 404));
});

//middleware to handel error
app.use((err, req, res, next) => {
  let { message = "something went wrong ie default meaage", status = 500 } =
    err;
  res.render("./listings/error.ejs", { message });
  // res.status(status).send(message);
});
