const express = require("express");

const { verifyToken } = require("../middlewares/verifyToken");
const {
  getPosts,
  addPost,
  getPost,
  updatePost,
  deletePost,
} = require("./../controllers/post.controller");

const router = express.Router();

router.get("/", getPosts);
router.post("/", verifyToken, addPost);
router.get("/:id", getPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

module.exports = router;
