exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user is set by your existing authMiddleware
    console.log(req.user.role, allowedRoles);
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied. Insufficient permissions." });
    }
    next();
  };
};
