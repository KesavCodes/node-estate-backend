const prisma = require("../lib/prisma.js");
const bcrypt = require("bcrypt");
const getUsers = async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany();
    return res
      .status(200)
      .json({ message: "Successfully retrieved users", data: allUsers });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Failed to retrieving users." });
  }
};
const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return res.status(401).json({ message: "Not authorized" });
    return res
      .status(200)
      .json({ message: "Successfully retrieved users", data: user });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Failed to get user." });
  }
};
const updateUser = async (req, res) => {
  const id = req.params.id;
  if (req.userId !== id)
    return res.status(403).json({ message: "Not Authorized" });
  try {
    const { password, avatar, ...userInput } = req.body;
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    console.log(avatar);
    const { password: newHashedPassword, ...updatedUserData } =
      await prisma.user.update({
        where: { id: req.params.id },
        data: {
          ...userInput,
          ...(hashedPassword && { password: hashedPassword }),
          ...(avatar && { avatar }),
        },
      });
    return res
      .status(200)
      .json({ message: "Successfully updated users", data: updatedUserData });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Failed to update user." });
  }
};
const deleteUser = async (req, res) => {
  const id = req.params.id;
  if (req.userId !== id)
    return res.status(403).json({ message: "Not Authorized" });
  try {
    const { password, ...userDetails } = await prisma.user.delete({
      where: { id },
    });
    return res
      .status(200)
      .json({ message: "Successfully deleted users", data: userDetails });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Failed to delete user." });
  }
};

const savePost = async (req, res) => {
  const postId = req.body.postId;
  const userId = req.userId;
  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    if (savedPost) {
      await prisma.savedPost.delete({
        where: { id: savedPost.id },
      });
      return res.status(200).json({ message: "Successfully unsaved post" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId,
          postId,
        },
      });
      return res.status(200).json({ message: "Successfully saved post" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

const profilePosts = async (req, res) => {
  const userId = req.userId;
  try {
    const allPosts = await prisma.user.findMany({
      where: { id: userId },
      include: {
        posts: true,
        savedPost: {
          include: {
            post: true,
          },
        },
      },
    });
    return res.status(200).json({
      message: "Successfully retrieved posts related to the users",
      data: allPosts,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Failed to retrieving posts." });
  }
};

const getNotificationNumber = async (req, res) => {
  const userId = req.userId;
  try {
    const notificationCount = await prisma.chat.count({
      where: {
        userIds: {
          hasSome: [userId],
        },
        NOT: {
          seenBy: {
            hasSome: [userId],
          },
        },
      },
    });
    return res.status(200).json({
      message: "Successfully retrieved notifications of the user",
      data: notificationCount,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Failed to notification count." });
  }
};
module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  savePost,
  profilePosts,
  getNotificationNumber,
};
