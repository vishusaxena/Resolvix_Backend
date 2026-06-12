const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  tenantCode: { type: String, required: true },
  departmentName: { type: String, required: true },
  departmentCode: { type: String, required: true, unique: true },
  departmentStatus: { type: String, required: true, default: "active" },
  departmentCreatedAt: { type: Date, default: Date.now },
  departmentUpdatedAt: { type: Date, default: Date.now },
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
