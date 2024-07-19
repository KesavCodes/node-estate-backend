const prisma = require("../lib/prisma.js");
const jwt = require("jsonwebtoken");

const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const postData = await prisma.post.findMany({
      where: {
        city: {
          equals: query.city || undefined,
          mode: "insensitive",
        },
        type: query.type && query.type !== "any" ? query.type : undefined,
        property:
          query.property && query.property !== "any" ? query.type : undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 10000000,
        },
      },
    });
    return res.status(200).json({
      message: "All post data retrieved successfully",
      data: postData,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Failed to retrieve post data" });
  }
};

const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const postData = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          return res.status(200).json({
            message: "Post data retrieved successfully",
            data: { ...postData, isSaved: saved ? true : false },
          });
        } else {
          return res.status(403).json({ message: "Invalid Token" });
        }
      });
    } else {
      return res.status(200).json({
        message: "Post data retrieved successfully",
        data: { ...postData, isSaved: false },
      });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Failed to retrieve post data" });
  }
};

const addPost = async (req, res) => {
  const userId = req.userId;
  try {
    const postData = await prisma.post.create({
      data: {
        ...req.body.postData,
        userId,
        postDetail: {
          create: req.body.postDetails,
        },
      },
    });
    return res
      .status(200)
      .json({ message: "Post added successfully", data: { postData } });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Failed to add post" });
  }
};

const updatePost = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  try {
    const postData = await prisma.post.update({
      where: {
        id,
      },
      data: { ...req.body, userId },
    });
    return res
      .status(200)
      .json({ message: "Post updated successfully", data: postData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Failed to update post" });
  }
};

const deletePost = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  try {
    const postData = await prisma.post.findUnique({
      where: {
        id,
      },
    });
    console.log(userId, postData.userId);
    if (userId !== postData.userId)
      return res.status(403).json({ message: "Not Authorized" });
    await prisma.post.delete({
      where: {
        id,
      },
    });
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Failed to delete post" });
  }
};

module.exports = {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
};
