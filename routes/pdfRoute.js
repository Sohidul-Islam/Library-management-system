const express = require("express");
const pdfController = require("../controllers/pdfController");

const router = express.Router();

router.get("", pdfController.getItemReviewPage);
// router.get("/find-review", itemReviewsController.findAll);
// router.route("/:id/view").get(itemReviewsController.findOne);
// router.post("/update-review", itemReviewsController.updateOne);
// router.post("/delete-review", itemReviewsController.deleteOne);

module.exports = router;
