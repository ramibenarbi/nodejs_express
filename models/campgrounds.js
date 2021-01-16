var mongoose = require("mongoose");

var lolSchema = new mongoose.Schema({
  name: String,
  price: String,
  img: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments",
    },
  ],
});
module.exports = mongoose.model("champs", lolSchema);
