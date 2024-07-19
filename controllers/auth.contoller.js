const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma.js");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { email, username, password } = req.body;
  // validation
  // have to write validation
  try {
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create a new user and save to the database
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        avatar:
          "https://www.murrayglass.com/wp-content/uploads/2020/10/avatar-1024x1024.jpeg",
      },
    });
    console.log(newUser);
    return res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Failed to create user." });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    //check if user exists
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) return res.status(401).json({ message: "Invalid credentials!" });
    //check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials!" });
    //generate cookie token and send it to the user
    // return res
    //   .setHeader("Set-Cookie", "test=" + "myValue") // without cookie parser lib
    //   .status(200)
    //   .json({ message: "Logged in successfully." });
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: age,
      }
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true // connection has to be https
        maxAge: age,
      })
      .status(200)
      .json({
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
      });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Failed to login user." });
  }
};

const logout = (req, res) => {
  return res
    .clearCookie("token")
    .status(200)
    .json({ message: "Logged out successfully." });
};

module.exports = {
  register,
  login,
  logout,
};
