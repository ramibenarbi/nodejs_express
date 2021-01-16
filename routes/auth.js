var express = require("express");
var router = express.Router();
var passport = require("passport");
var user = require("../models/user");
// root routes
router.get("/", function (req, res) {
  res.render("landing");
});

// register form
router.get("/register", function (req, res) {
  res.render("register");
});
// sign up logic
router.post("/register", function (req, res) {
  user.register(
    new user({ username: req.body.username }),
    req.body.password,
    function (err, user) {
      if (err) {
        req.flash("error", err.message);
        return res.render("register");
      }
      passport.authenticate("local")(req, res, function () {
        req.flash("success", "WELCOME TO YELPCAMP " + user.username);
        res.redirect("/campgrounds");
      });
    }
  );
});
// show login form
router.get("/login", (req, res) => {
  res.render("login");
});
// login logic middlware
// app.post("/login",middlware,callback)
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);
//app.logout
router.get("/logout", function (req, res) {
  req.logOut();
  req.flash("success", "you re logged out !");
  res.redirect("/campgrounds");
});

module.exports = router;
