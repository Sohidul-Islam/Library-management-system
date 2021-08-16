const express = require("express");
const usersController = require("../controllers/usersController");

const router = express.Router();

router.get("/", usersController.getUserPage);
router.get("/find-user", usersController.findAll);
router.route("/:id/view").get(usersController.findOne);
router.post("/delete-user", usersController.deleteOne);
router.post("/promote-user", usersController.promoteOne);

module.exports = router;
