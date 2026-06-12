const express = require("express");
const {
  InsertUpdateTenant,
  GetAllTenants,
  GetTenantById,
} = require("../controllers/tenantController");
const router = express.Router();

router.post("/tenant", InsertUpdateTenant);
router.get("/tenant/:id", GetTenantById);
router.get("/tenant", GetAllTenants);
// router.delete("/tenant/:id", DeleteTenant);

module.exports = router;
