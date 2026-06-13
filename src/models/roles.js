const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  roleName: { type: String, required: true },
  roleCode: { type: String, required: true },
  roleStatus: {
    type: Boolean,
    required: true,
    default: true,
  },
  roleCreatedAt: {
    type: Date,
    default: Date.now,
  },
  roleUpdatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Roles = mongoose.model("Roles", roleSchema);

module.exports = Roles;
