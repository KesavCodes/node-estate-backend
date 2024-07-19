const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not Authenticated" });
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    if (payload) {
      req.userId = payload.id;
      req.isAdmin = payload.isAdmin;
      next();
    } else {
      return res.status(500).json({ message: "Something went wrong" });
    }
  });
};

module.exports = { verifyToken };
