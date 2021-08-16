const express = require("express");
const resetPasswordController = require("../controllers/resetPasswordController");
const jwtConfig = require("../middleware/jwtConfig");

const router = express.Router();

router.get("/", (req, res, next) => {
    res.render("authentication/reset-password");
});

router.post("/", resetPasswordController.createOne);

module.exports = router;
