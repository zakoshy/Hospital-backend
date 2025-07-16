const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  const token = authHeader.split(" ")[1]; // ✅ Get just the token part

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ Now contains _id, role, etc.
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = protect;
