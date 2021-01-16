var express = require("express");
var router = express.Router();
var campground = require("../models/campgrounds");
var middelware = require("../middleware");

// show all the campgrounds
router.get("/", (req, res) => {
  console.log(req.user);
  campground.find({}, function (err, allCampground) {
    if (err) {
      req.flash("error", err);
    } else {
      res.render("campground/index", { campground: allCampground });
    }
  });
});

// add new campground to db
router.post("/", middelware.isLoggedIn, (req, res) => {
  var name = req.body.name;
  var price = req.body.price;
  var img = req.body.img;
  var desc = req.body.desc;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  var camp = {
    name: name,
    price: price,
    img: img,
    description: desc,
    author: author,
  };
  campground.create(camp, function (err, newCamp) {
    if (err) {
      req.flash("error", err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});
// new campground form
router.get("/new", middelware.isLoggedIn, (req, res) => {
  res.render("campground/newcampground");
});

// show more info about the campgrounds
router.get("/:id", (req, res) => {
  campground
    .findById(req.params.id)
    .populate("comments")
    .exec((err, found) => {
      if (err || !found) {
        req.flash("error", "campground not found");
        res.redirect("back");
      } else {
        console.log(found);
        res.render("campground/show", { campground: found });
      }
    });
});
// edit form
router.get(
  "/:id/edit",
  middelware.checkCampgroundOwnerShip,
  function (req, res) {
    campground.findById(req.params.id, function (err, found) {
      if (err) {
        req.flash("error", "campground not found");
      }
      res.render("campground/edit", { campground: found });
    });
  }
);
// update the campground
router.put("/:id", middelware.checkCampgroundOwnerShip, function (req, res) {
  // find and update and redirect
  campground.findByIdAndUpdate(
    req.params.id,
    req.body.camp,
    function (err, updatedOne) {
      if (err) {
        console.log(err);
        res.redirect("/campgrounds");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
});
// delete
router.delete("/:id", middelware.checkCampgroundOwnerShip, function (req, res) {
  campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "campground deleted");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
