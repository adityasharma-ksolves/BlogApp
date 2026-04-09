const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.syncUser = async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  console.log("login with email password", auth0Id);
  const { name, email } = req.body;

  try {
    let user = await pool.query("SELECT * FROM users WHERE auth0_id = $1", [
      auth0Id,
    ]);

    if (user.rows.length === 0) {
      user = await pool.query(
        "INSERT INTO users (name, email, auth0_id, role) VALUES ($1, $2, $3, 'user') RETURNING *",
        [name, email, auth0Id],
      );
    }

    // Issue custom JWT for frontend AuthContext
    const customToken = jwt.sign(
      { userId: user.rows[0].id, role: user.rows[0].role || "user" },
      process.env.JWT_SECRET || "secret-key",
      { expiresIn: "24h" },
    );

    res.json({
      user: user.rows[0],
      token: customToken,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  console.log(req.body);
  console.log(req.auth);

  try {
    const user = await pool.query("SELECT * FROM users WHERE auth0_id = $1", [
      auth0Id,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
