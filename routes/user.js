const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsyn = require("../utils/wrapAsync");
const session = require("express-session");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware"); //this is middleware use to go to previus page after loggin
const LocalStrategy = require("passport-local").Strategy; // Import the LocalStrategy

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // Store user in session
passport.deserializeUser(User.deserializeUser()); // Retrieve user from session

passport.serializeUser(User.serializeUser()); //since i am also using llocal-mongoose
passport.deserializeUser(User.deserializeUser());

router.get("/signup", (req, res) => {
  res.render("./user/signup");
});

router.post("/signup", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", "username or email already exists");
    console.log(e);
    res.redirect("/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("./user/login");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "welcome to wandelust");

    res.redirect("/listings");
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    req.flash("success", "you have successfully logged out now");
    res.redirect("/login");
  });
});

module.exports = router;
