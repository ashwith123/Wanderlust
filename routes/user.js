const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsyn = require("../utils/wrapAsyn");
const session = require("express-session");
const passport = require("passport");

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
    console.log(e);

    res.redirect("/signup");
  }
});

router.get(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    faillureFlash: true,
  }),
  async (req, res) => {
    req.flash("sucess", "welcome to wandelust");
    res.redirect("/listings");
  }
);

router.post("/login", async (req, res) => {});

module.exports = router;
