const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsyn = require("../utils/wrapAsyn");
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
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "welcome to wandelust");
    console.log("Logged-in User:", req.user);
    if (res.locals.redirectUrl) {
      //when you go directly to home page and login the is loggedin middle ware is not triggerred and die to which the next middle ware is also not triggered
      res.redirect(res.locals.redirectUrl);
    } else {
      res.redirect("/listings");
    }
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    req.flash("success", "you have successfully logged out now");
    res.redirect("/listings");
  });
});

module.exports = router;
