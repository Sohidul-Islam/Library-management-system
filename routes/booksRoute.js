const express = require("express");
const signInController = require("../controllers/signInController");
const booksController = require("../controllers/booksController");
const multerConfig = require("../middleware/multerConfig");

const router = express.Router();

router.get("/", booksController.getBookPage);
router.get("/find-book", booksController.findAll);

router.get("/add-book", booksController.getAddBookPage);

router.post(
    "/add-book",
    multerConfig.upload.fields([
        {
            name: "file",
            maxCount: 1,
        },
        {
            name: "img",
            maxCount: 1,
        },
    ]),
    booksController.addNewBook
);
router.route("/:id/view").get(booksController.findOne);

router.get("/book-details", (req, res, next) => {
    res.render("books/book-details.ejs");
    next();
});

module.exports = router;
