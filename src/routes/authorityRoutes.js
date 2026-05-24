const express = require("express");
const {
  getAssignedGrievances,
  resolveGrievance,
  sendResolutionEmail,
} = require("../controllers/authorityController");
const authMiddleware = require("../middleware/auth");
const roleAuth = require("../middleware/roleAuth");

const router = express.Router();

router.get(
  "/assigned",
  authMiddleware,
  roleAuth(["authority"]),
  getAssignedGrievances
);

router.put("/:id", authMiddleware, roleAuth(["authority"]), resolveGrievance);

router.post(
  "/send-email",
  authMiddleware,
  roleAuth(["authority"]),
  sendResolutionEmail
);

module.exports = router;
