const express = require("express");
// const signInController = require("../controllers/signInController");

const router = express.Router();
router.get("/", (req, res, next) => {
    res.render("books/profile");
    next();
});
// router.get("/book-details", (req, res, next) => {
//     res.render("books/book-details.ejs");
//     next();
// });

// router.post("/", signInController.signIn);

module.exports = router;
