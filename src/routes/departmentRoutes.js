const express = require("express");
const {
  InsertUpdateDepartment,
  GetAllDepartments,
  GetDepartmentById,
} = require("../controllers/DepartmentController");
const router = express.Router();

router.post("/department", InsertUpdateDepartment);
// router.get("/department/:id", GetDepartmentById);
router.get("/department/:id", GetAllDepartments);
// router.delete("/department/:id", DeleteDepartment);

module.exports = router;
