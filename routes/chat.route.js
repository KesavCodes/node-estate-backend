const express = require("express");

const {
  getChats,
  createChat,
  getChat,
  readChat,
} = require("../controllers/chat.controller");

const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/", verifyToken, getChats);

router.post("/", verifyToken, createChat);

router.get("/:id", verifyToken, getChat);

router.put("/read/:id", verifyToken, readChat);

module.exports = router;
