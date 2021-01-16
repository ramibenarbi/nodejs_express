var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");
var localStrategy = require("passport-local");
var methode_override = require("method-override");
mongoose.connect("mongodb://localhost/lol_v10");

var seedsDB = require("./seeds");
var user = require("./models/user");
// requiring routes
var commentRoutes = require("./routes/comment");
var campgroundRoutes = require("./routes/campground");
var authRoutes = require("./routes/auth");
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methode_override("_method"));
app.use(flash());
//seedsDB(); //seed db
// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "legends never die",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
/// this ll call on every single routes
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
app.use("/", authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.listen(3000, () => {
  console.log("server started");
});
