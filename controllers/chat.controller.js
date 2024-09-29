const prisma = require("../lib/prisma.js");
const getChats = async (req, res) => {
  const userId = req.userId;
  try {
    const allChats = await prisma.chat.findMany({
      where: {
        userIds: {
          hasSome: [userId],
        },
      },
    });

    for (const chat of allChats) {
      const receiverId = chat.userIds.find((id) => id !== userId);
      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });
      chat.receiver = receiver;
    }
    return res
      .status(200)
      .json({ message: "Successfully retrieved chats", data: allChats });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Failed to retrieving chats." });
  }
};
const getChat = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;
  try {
    const chat = await prisma.chat.findUnique({
      where: { id, userIds: { hasSome: [userId] } },
    });
    if (!chat) throw new Error("Couldn't find chat");
    const updatedChat = await prisma.chat.update({
      where: { id },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      data: {
        seenBy: {
          push: [userId],
        },
      },
    });
    return res
      .status(200)
      .json({ message: "Successfully retrieved a chat", data: updatedChat });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Failed to get chat." });
  }
};
const createChat = async (req, res) => {
  const userId = req.userId;
  try {
    const isChatExist = await prisma.chat.findMany({
      where:{
        OR: [
          {
            userIds: {
              equals: [userId, req.body.receiverId],
            },
          },
          {
            userIds: {
              equals: [req.body.receiverId, userId],
            },
          },
        ],
      }
    })
    if(isChatExist)  return res
    .status(400)
    .json({ message: "Chat Already exists!" });

    const newChat = await prisma.chat.create({
      data: {
        userIds: [userId, req.body.receiverId],
      },
    });
    return res
      .status(200)
      .json({ message: "Successfully created a chat", data: newChat });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Failed to create a chat." });
  }
};
const readChat = async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;
  try {
    const updatedChat = await prisma.chat.update({
      where: {
        id,
        userIds: {
          hasSome: [userId],
        },
      },
      data: {
        seenBy: {
          push: [userId],
        },
      },
    });
    if (!updatedChat)
      return res.status(401).json({ message: "Not authorized" });
    return res
      .status(200)
      .json({ message: "Successfully retrieved a chat", data: updatedChat });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Failed to get user." });
  }
};

module.exports = {
  getChats,
  getChat,
  createChat,
  readChat,
};
