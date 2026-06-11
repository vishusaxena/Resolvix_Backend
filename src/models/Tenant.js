const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  tenantName: { type: String, required: true },
  tenantType: { type: String, required: true },
  tenantCode: { type: String, required: true, unique: true },
  tenantEmail: { type: String, required: true },
  tenantPhone: { type: String, required: true },
  tenantWebsite: { type: String },
  tenantAddress: {
    addressLine1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  tenantStatus: { type: String, required: true, default: "active" },
  tenantCreatedAt: { type: Date, default: Date.now },
  tenantUpdatedAt: { type: Date, default: Date.now },
});

const Tenant = mongoose.model("Tenant", tenantSchema);

module.exports = Tenant;
