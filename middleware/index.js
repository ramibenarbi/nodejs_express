var campground = require("../models/campgrounds");
var comments = require("../models/comment");
// all middleware goes here
var middlewareObj = {};
middlewareObj.checkCampgroundOwnerShip = function (req, res, next) {
  if (req.isAuthenticated()) {
    campground.findById(req.params.id, function (err, found) {
      if (err || !found) {
        req.flash("error", "campground not found");
        res.redirect("back");
      } else {
        // if user owe this post
        //req.user._id=>string | found.author.id=>object|equals =mongoose method
        if (found.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "you need to be logged in to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Permission denied");
    res.redirect("back");
  }
};
middlewareObj.checkCommentsOwnerShip = function (req, res, next) {
  if (req.isAuthenticated()) {
    comments.findById(req.params.comment_id, function (err, found) {
      if (err) {
        req.flash("error", "comment not found");
        res.redirect("back");
      } else {
        // if user owe this post
        //req.user._id=>string | found.author.id=>object|equals =mongoose method
        if (found.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "you need to be logged in to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Permission denied");
    res.redirect("back");
  }
};
// middlware
middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please login first!");
  res.redirect("/login");
};

module.exports = middlewareObj;
