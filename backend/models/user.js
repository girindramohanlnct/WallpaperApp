const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { Binary } = require("mongodb");
const { Buffer } = require("buffer");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true, sparse: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  profilePic: { type: Buffer, required: true },
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
