const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

router.post("/add-category", categoryController.createCategory);
router.get("/", categoryController.getCategoryPage);
router.get("/find-category", categoryController.findAll);
router.post("/update-category", categoryController.updateOne);
router.post("/delete-category", categoryController.deleteOne);

module.exports = router;
