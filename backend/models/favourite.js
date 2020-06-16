const mongoose = require("mongoose");

const favSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  imageId: { type: String, required: true },
  download_url: { type: String, required: true },
  url: { type: String, required: true },
  height: { type: String, required: true },
  width: { type: String, required: true },
  author: { type: String, required: true },
});

module.exports = mongoose.model("Favourites", favSchema);
