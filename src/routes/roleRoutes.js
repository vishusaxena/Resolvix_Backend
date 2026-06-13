const express = require("express");
const {
  InsertUpdaterole,
  GetAllroles,
  GetroleById,
} = require("../controllers/roleController");
const router = express.Router();

router.post("/roles", InsertUpdaterole);
// router.get("/role/:id", GetroleById);
router.get("/roles", GetAllroles);
// router.delete("/role/:id", Deleterole);

module.exports = router;
