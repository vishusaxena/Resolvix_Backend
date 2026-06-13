const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
  GetAllUsers,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile);
router.get("/users/:id", GetAllUsers);

module.exports = router;
