var express = require("express");
var router = express.Router({ mergeParams: true });
var campground = require("../models/campgrounds");
var comments = require("../models/comment");
var middelware = require("../middleware");
// new comment
router.get("/new", middelware.isLoggedIn, (req, res) => {
  campground.findById(req.params.id, (err, found) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: found });
    }
  });
});

// comment create
router.post("/", middelware.isLoggedIn, (req, res) => {
  campground.findById(req.params.id, (err, found) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      comments.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash("error", "something went wrong");
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          found.comments.push(comment);
          found.save();
          req.flash("success", "Successfully created the comment");
          res.redirect("/campgrounds/" + req.params.id);
        }
      });
    }
  });
});
// edit form
router.get(
  "/:comment_id/edit",
  middelware.checkCommentsOwnerShip,
  function (req, res) {
    campground.findById(req.params.id, function (err, found_camp) {
      if (err || !found_camp) {
        req.flash("error", "campground not found");
        res.redirect("back");
      } else {
        comments.findById(req.params.comment_id, function (err, found) {
          if (err || !found) {
            req.flash("error", "comment not found");
            res.redirect("back");
          } else {
            res.render("comments/edit", {
              comment: found,
              campground_id: req.params.id,
            });
          }
        });
      }
    });
  }
);
//update form
router.put(
  "/:comment_id",
  middelware.checkCommentsOwnerShip,
  function (req, res) {
    comments.findByIdAndUpdate(
      req.params.comment_id,
      req.body.comment,
      function (err, updatedOne) {
        if (err) {
          res.redirect("back");
        } else {
          res.redirect("/campgrounds/" + req.params.id);
        }
      }
    );
  }
);
// comments destroyer

router.delete(
  "/:comment_id",
  middelware.checkCommentsOwnerShip,
  function (req, res) {
    comments.findByIdAndRemove(req.params.comment_id, function (err) {
      if (err) {
        res.redirect("back");
      } else {
        req.flash("error", "comment deleted!");
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
  }
);

module.exports = router;
