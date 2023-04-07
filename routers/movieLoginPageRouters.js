const express = require("express");
const movieLoginPageController = require("../controllers/movieLoginPageControllers");


const router = express.Router();

router.post("/login", movieLoginPageController.movie_login);
router.post("/sign-up", movieLoginPageController.movie_signUp);
router.post("/change-password", movieLoginPageController.movie_changePassword);

module.exports = router;