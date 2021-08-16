const express = require("express");
const authorsController = require("../controllers/authorsController");

const router = express.Router();

router.get("/", authorsController.getAuthorPage);
router.get("/find-author", authorsController.findAll);
router.route("/:id/view").get(authorsController.findOne);
router.post("/delete-user", authorsController.deleteOne);

module.exports = router;
