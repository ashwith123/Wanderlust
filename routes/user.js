const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsyn = require("../utils/wrapAsyn");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; // Import the LocalStrategy

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //since i am also using llocal-mongoose
passport.deserializeUser(User.deserializeUser());

router.get("/signup", (req, res) => {
  res.render("./user/signup");
});

router.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    res.redirect("/listings");
  } catch (e) {
    req.flash("error", "username or email already exists");
    res.redirect("/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("./user/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "welcome to wandelust");
    res.redirect("/listings");
  }
);

module.exports = router;
