const router = require("express").Router();

const userController = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");

router.post("/signup", userController.registration);
router.post("/login", userController.login);
router.post("/addFav", checkAuth, userController.addFavourites);
router.get("/getFav", checkAuth, userController.getFavourites);

module.exports = router;
