const express = require("express");
const verifyController = require("../controllers/verifyController");

const router = express.Router();
router.get("/", (req, res, next) => {
    res.render("authentication/verify");
    next();
});
// router.post("/", (req, res, next) => {
//     console.log("success");
//     res.send("success");
// });

router.post("/", verifyController.verify);

module.exports = router;
