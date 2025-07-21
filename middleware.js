module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log("user is not authenticated");
    req.session.redirectUrl = req.originalUrl; // this will help us redirect to the original url which we were before clicking login
    req.flash("error", "you must be logged in for this feature");
    return res.redirect("/login");
  }
  console.log("user si authenticated");
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
