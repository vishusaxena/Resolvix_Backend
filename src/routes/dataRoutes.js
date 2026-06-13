const express = require("express");
const router = express.Router();
const { getDataOptions } = require("../controllers/dataController");

// Bind the route to your controller method
router.get("/", getDataOptions);

module.exports = router;
