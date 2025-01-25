module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated) {
    req.flash("error", "you must be logged in for this feature");
    return res.redirect("/login");
  }
  next();
};
