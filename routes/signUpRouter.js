const express = require("express");
const signUpController = require("../controllers/signUpController");
const verifyController = require("../controllers/verifyController");

const router = express.Router();

router.get("/", (req, res, next) => {
    res.render("authentication/sign-up");
});
router.get("/sign-up", (req, res, next) => {
    res.render("authentication/sign-up");
});

router.post("/check-email", signUpController.checkEmail);
router.post("/", signUpController.createOne);
// router.post("/", signUpController.createOne, verifyController.createOne);

module.exports = router;
