const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    req.payload = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { isAuthenticated };
