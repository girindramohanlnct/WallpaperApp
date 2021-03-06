const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodeToken = jwt.verify(token, "secert_this_should_be_longer123");
    req.userData = { email: decodeToken.email, userId: decodeToken.userId };
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Authorization failed",
    });
  }
};
