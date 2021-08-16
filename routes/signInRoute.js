const express = require("express");
const signInController = require("../controllers/signInController");

const router = express.Router();
router.get("/", (req, res) => {
    res.render("authentication/sign-in");
});

router.post("/", signInController.signIn);

module.exports = router;
