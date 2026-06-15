const express = require("express");
const {
  getAllGrievances,
  getGrievanceById,
  updateGrievanceStatus,
  deleteGrievance,
  GetAllGrievancesByDepartment,
} = require("../controllers/grievanceController");
const authMiddleware = require("../middleware/auth");
const roleAuth = require("../middleware/roleAuth");

const router = express.Router();

router.get("/", authMiddleware, getAllGrievances);
router.get("/department", authMiddleware, GetAllGrievancesByDepartment);
router.get("/:id", authMiddleware, getGrievanceById);
router.put(
  "/:id",
  authMiddleware,
  roleAuth(["admin", "authority"]),
  updateGrievanceStatus,
);
router.delete("/:id", authMiddleware, roleAuth(["admin"]), deleteGrievance);

module.exports = router;
