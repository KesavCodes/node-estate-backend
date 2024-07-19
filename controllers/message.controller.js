const prisma = require("../lib/prisma");

const addMessage = async (req, res) => {
  const userId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIds: { hasSome: [userId] },
      },
    });
    if (!chat) return res.status(404).json({ message: "Chat not found!" });
    const message = await prisma.message.create({
      data: {
        text,
        userId,
        chatId,
      },
    });
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        seenBy: {
          set: [userId],
        },
        lastMessage: text,
      },
    });
    return res
      .status(200)
      .json({ message: "Chat created successfully", data: message });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong! Failed to add message." });
  }
};

module.exports = {
  addMessage,
};
