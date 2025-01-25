const express = require("express");
var app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsyn");
const expressError = require("./utils/expressError");
const listingSchema = require("./schema");
const Review = require("./models/reviews");
const userRouter = require("./routes/user");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/reviews.js");
const flash = require("connect-flash");
const sessions = require("express-session");
const passport = require("passport");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Make sure views folder is set correctly
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "public")));

//sessions-ie store temp info or cokkie
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    // this will not ask login for certain time
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
  },
};

app.use(sessions(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// checks if connection is successfull main is name of function in which connection is being given
main()
  .then(() => {
    console.log("connection successul");
  })
  .catch((err) => {
    console.log(err);
  });
//connecting mongoose
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

//routes
app.use("/", userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);

app.get("/", (req, res) => {
  req.flash("success", "user registered successfully");
  res.send("hi this is projects Root");
});

//reviews

app.post("/listings/<%=listing._id%>/review", async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  Listing.review.push(newReview);

  await newReview.save(); //cr
  await listing.save();
});

app.listen(7070, () => {
  console.log("server is listening");
});

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
