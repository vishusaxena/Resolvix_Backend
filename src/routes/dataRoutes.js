const express = require("express");
const router = express.Router();
const {
  getDataOptions,
  getGrievanceOfficers,
} = require("../controllers/dataController");

// Bind the route to your controller method
router.get("/", getDataOptions);
router.get("/officer-data", getGrievanceOfficers);

module.exports = router;
