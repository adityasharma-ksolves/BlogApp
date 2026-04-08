const pool = require("../config/db");
exports.createUser = async (req, res) => {
  try {
    const { username, age } = req.body;
    const result = await pool.query(
      "Insert into users (username,age) values($1,$2) RETURNING*",
      [username, age],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query("Select * from users");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
