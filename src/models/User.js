const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    tenantCode: { type: String, required: true },
    userCode: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
    },
    department: { type: String, default: "General" },
    isActive: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);
userSchema.index(
  {
    tenantCode: 1,
    userCode: 1,
  },
  {
    unique: true,
  },
);
module.exports = mongoose.model("User", userSchema);
