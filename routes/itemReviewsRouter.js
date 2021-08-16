const express = require("express");
const itemReviewsController = require("../controllers/itemReviewsController");

const router = express.Router();

router.get("/", itemReviewsController.getItemReviewPage);
router.get("/find-review", itemReviewsController.findAll);
router.post("/published-review", itemReviewsController.publishFindAll);
// router.route("/:id/view").get(itemReviewsController.findOne);
router.post("/add-review", itemReviewsController.addReview);
router.post("/update-review", itemReviewsController.updateOne);
router.post("/update-review_status", itemReviewsController.updateStatusOne);
router.post("/delete-review", itemReviewsController.deleteOne);
router.route("/find-user-review").post(itemReviewsController.findUserOne);

module.exports = router;
