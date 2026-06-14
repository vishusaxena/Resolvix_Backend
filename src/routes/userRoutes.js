const express = require("express");
const {
  getUserGrievances,
  submitGrievance,
  closeGrievance,
  resubmitGrievance,
  deleteGrievance,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/grievances", authMiddleware, getUserGrievances);
router.post("/grievance/:id", authMiddleware, submitGrievance);
router.patch("/grievance/:id/close", authMiddleware, closeGrievance);
router.post("/grievance/resubmit", authMiddleware, resubmitGrievance);
router.delete("/grievance/:id", authMiddleware, deleteGrievance);
module.exports = router;
