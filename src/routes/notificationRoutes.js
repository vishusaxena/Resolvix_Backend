const express = require("express");
const {
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware, getNotifications); 
router.put("/:id", authMiddleware, markAsRead); 

module.exports = router;
