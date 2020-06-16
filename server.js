const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const fileUpload = require("express-fileupload");

const userRoutes = require("./backend/routes/user");

mongoose
  .connect(
    "mongodb+srv://mohan:xQESqiXlYQnYNbMG@cluster0-iv487.mongodb.net/wallpaperApp"
  )
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("connection failed");
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(express.static(path.join("https://unsplash.com/photos/yC-Yzbqy7PY")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
app.listen(3000);

app.use("/api/user", userRoutes);

module.exports = app;
