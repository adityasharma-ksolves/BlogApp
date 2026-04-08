const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, age } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const result = await pool.query(
//       "Insert into users (name,email,password,age) values ($1,$2,$3,$4) RETURNING *",
//       [name, email, hashedPassword, age],
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.register = async (req, res) => {
//   const { name, email, password, age, adminCode } = req.body;
//   let assignedRole = "user";

//   try {
//     // Check if the provided code matches the Master Admin Code
//     if (adminCode && adminCode === process.env.ADMIN_SECRET_CODE) {
//       assignedRole = "admin";
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await pool.query(
//       "INSERT INTO users (name, email, password, role,age) VALUES ($1, $2, $3, $4,$5) RETURNING id,name, email, role,age",
//       [name, email, hashedPassword, assignedRole, age],
//     );

//     res.status(201).json({
//       message:
//         assignedRole === "admin" ? "Registered as Admin" : "Registered as User",
//       user: newUser.rows[0],
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     // Fetch user
//     const result = await pool.query("Select * from users where email=$1", [
//       email,
//     ]);
//     if (result.rows.length === 0) {
//       res.status(400).json({ error: "User not found" });
//     }
//     const user = result.rows[0]; // setting user

//     // password match

//     const isMatched = bcrypt.compare(password, user.password);
//     if (!isMatched) {
//       res.status(400).json({ error: "Invalid credentials" });
//     }

//     // generate token

//     const token = jwt.sign({ userId: user.id, role: user.role }, "secret-key", {
//       expiresIn: "24h",
//     });

//     // 3. Send the cookie
//     res.cookie("token", token, {
//       httpOnly: true, // Shield from JS
//       secure: true, // Only over HTTPS
//       sameSite: "Strict", // CSRF protection
//       maxAge: 3600000, // 1 hour in milliseconds
//     });

//     res.status(200).json({
//       message: "Login Successful",
//       token: token,
//     });
//     console.log(res);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// 🔁 Sync user (register + login combined)
exports.syncUser = async (req, res) => {
const auth0Id = req.auth.payload.sub;
const { name, email, age } = req.body;
console.log(req.body);

try {
let user = await pool.query(
"SELECT * FROM users WHERE auth0_id = $1",
[auth0Id]
);


// 🆕 If new user → INSERT
if (user.rows.length === 0) {
  user = await pool.query(
    "INSERT INTO users (name, email, age, auth0_id, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, email, age, auth0Id, "user"]
  );
}

res.status(200).json(user.rows[0]);


} catch (err) {
res.status(500).json({ error: err.message });
}
};

// 🔒 Protected route example
exports.getProfile = async (req, res) => {
const auth0Id = req.auth.payload.sub;
console.log(req.body);
console.log(req.auth)

try {
const user = await pool.query(
"SELECT * FROM users WHERE auth0_id = $1",
[auth0Id]
);

if (user.rows.length === 0) {
  return res.status(404).json({ error: "User not found" });
}

res.json(user.rows[0]);

} catch (err) {
res.status(500).json({ error: err.message });
}
};
