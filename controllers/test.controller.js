const jwt = require("jsonwebtoken");

const shouldBeLoggedIn = async (req, res) => {
  console.log("should be logged in....");
  const userId = req.userId;
  if (!userId)
    return res.status(500).json({ message: "Something went wrong!" });
  return res.status(200).json({ message: "You are Authenticated" });
};
const shouldBeAdmin = async (req, res) => {
  const userId = req.userId;
  const isAdmin = req.isAdmin;
  if (!userId)
    return res.status(500).json({ message: "Something went wrong!" });
  if (!isAdmin)
    return res.status(403).json({ message: "Not sufficient privilege" });
  return res.status(200).json({ message: "You are Admin!" });
};

module.exports = {
  shouldBeLoggedIn,
  shouldBeAdmin,
};
