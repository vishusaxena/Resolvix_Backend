const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
  GetAllUsers,
  logintenant,
  GetTenantData,
  GetDepartmentData,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile);
router.get("/users/:id", GetAllUsers);
router.post("/tenantlogin", logintenant);
router.get("/tenant-info/:id", GetTenantData);
router.get("/department-info", authMiddleware, GetDepartmentData);

module.exports = router;
