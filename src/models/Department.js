const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  tenantCode: { type: String, required: true },
  departmentName: { type: String, required: true },
  departmentCode: { type: String, required: true },
  departmentStatus: {
    type: Boolean,
    required: true,
    default: true,
  },
  departmentCreatedAt: {
    type: Date,
    default: Date.now,
  },
  departmentUpdatedAt: {
    type: Date,
    default: Date.now,
  },
});

departmentSchema.index(
  {
    tenantCode: 1,
    departmentCode: 1,
  },
  {
    unique: true,
  },
);

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
