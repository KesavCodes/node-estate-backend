const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const testRoute = require("./routes/test.route.js");

const authRoute = require("./routes/auth.route.js");
const pathRoute = require("./routes/post.route.js");
const userRoute = require("./routes/user.route.js");
const chatRoute = require("./routes/chat.route.js");
const messageRoute = require("./routes/message.route.js");

const PORT = process.env.PORT || 8080;

app.use(cookieParser());
app.use(express.json());

app.use("/api/test", testRoute);

app.use("/api/auth", authRoute);
app.use("/api/posts", pathRoute);
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.listen(PORT, () => console.log("listening on port : " + PORT));
