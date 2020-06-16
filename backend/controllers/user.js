const mongodb = require("mongodb");
const fs = require("fs");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Favs = require("../models/favourite");
const { isTemplateSpan } = require("typescript");

const binary = mongodb.Binary;

exports.registration = async (req, res, next) => {
  //   console.log(req.body);
  //   console.log(req.files);
  let hashPass = await bcrypt.hash(req.body.password, 10);
  if (!hashPass) {
    res.status(404).json({
      message: "password not hashed",
    });
  }
  let user = new User({
    email: req.body.emailid,
    name: req.body.name,
    phone: req.body.phone,
    password: hashPass,
    profilePic: binary(req.files.profilePic.data),
  });

  user
    .save()
    .then((result) => {
      res.status(200).json({
        message: "user created",
        result: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: "user not created",
        error: err,
      });
    });
};

exports.login = (req, res, next) => {
  let fatchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "auth failed",
        });
      }
      fatchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "auth failed",
        });
      }
      const token = jwt.sign(
        { email: fatchedUser.email, userId: fatchedUser._id },
        "secert_this_should_be_longer123",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fatchedUser._id,
        userName: fatchedUser.name,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({
        message: "auth failed",
      });
    });
};

exports.addFavourites = async (req, res, next) => {
  const userId = req.userData.userId;
  console.log("Add Fac");

  try {
    const items = await Favs.find({
      userId: userId,
      imageId: req.body.imageId,
    });

    if (items.length === 0 || !items) {
      const fav = Favs({
        userId: userId,
        url: req.body.url,
        imageId: req.body.imageId,
        download_url: req.body.download_url,
        height: req.body.height,
        width: req.body.width,
        author: req.body.author,
      });

      fav
        .save()
        .then((result) => {
          res.status(200).json({
            message: "fav Added",
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json({
            message: "not Adeed",
          });
        });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Already added",
    });
  }
};

exports.getFavourites = async (req, res, next) => {
  console.log("FAv");
  Favs.find({ userId: req.userData.userId })
    .then((items) => {
      res.status(200).json({
        favs: items,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "not Fatched",
      });
    });
};
