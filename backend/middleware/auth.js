const jwt = require("jsonwebtoken");

/*
  Reads "Authorization: Bearer <token>" header,
  verifies it, and attaches decoded user info to req.user
*/
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
}

/*
  Restricts a route to specific roles.
  Usage: requireRole("admin"), requireRole("mess_owner", "admin")
*/
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to do this"
      });
    }
    next();
  };
}

module.exports = { verifyToken, requireRole };
