const express = require("express");
const {
  getAllUsers,
  getAllAuthorities,
  assignGrievance,
  closeGrievance,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/auth");
const roleAuth = require("../middleware/roleAuth");

const router = express.Router();

router.get("/users", authMiddleware, roleAuth(["admin"]), getAllUsers);
router.get(
  "/authorities",
  authMiddleware,
  roleAuth(["admin"]),
  getAllAuthorities
);
router.put(
  "/assign/:grievanceId",
  authMiddleware,
  roleAuth(["admin"]),
  assignGrievance
);
router.put(
  "/close/:grievanceId",
  authMiddleware,
  roleAuth(["admin"]),
  closeGrievance
);

module.exports = router;
