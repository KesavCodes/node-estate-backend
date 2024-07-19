const express = require("express");
const { verifyToken } = require("../middlewares/verifyToken");
const {
  shouldBeLoggedIn,
  shouldBeAdmin,
} = require("../controllers/test.controller");

const router = express.Router();

router.get("/should-be-logged-in", verifyToken, shouldBeLoggedIn);
router.get("/should-be-admin", shouldBeAdmin);

module.exports = router;
