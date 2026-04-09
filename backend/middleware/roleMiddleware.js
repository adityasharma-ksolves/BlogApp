const pool = require("../config/db");
exports.authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    // console.log(req, allowedRoles);
    // req.user is set by your existing authMiddleware
    const auth0Id = req.auth.payload.sub;
    const userResult = await pool.query(
      "SELECT * FROM users WHERE auth0_id = $1",
      [auth0Id],
    );
    // console.log(userResult.rows[0].role)
    if (!allowedRoles.includes(userResult.rows[0].role)) {
      return res
        .status(403)
        .json({ error: "Access denied. Insufficient permissions." });
    }
    next();
  };
};
