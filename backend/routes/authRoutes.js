const express = require("express");
const {
  login,
  register,
  syncUser,
  getProfile,
} = require("../controllers/authController");
const router = express.Router();

const { checkJwt } = require("../middleware/authMiddleware");


router.post("/sync-user", checkJwt, syncUser);
router.get("/profile", checkJwt, getProfile);

module.exports = router;
