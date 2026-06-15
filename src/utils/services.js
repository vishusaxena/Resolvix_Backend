const Department = require("../models/Department");
const Grievance = require("../models/Grievance");
const Roles = require("../models/roles");
const Tenant = require("../models/Tenant");
const User = require("../models/User");
const crypto = require("crypto");

const generateUniqueTenantCode = async (initials, prefixCount, type, code) => {
  if (type === "tenant") {
    const count = await Tenant.countDocuments();
    return `${initials}-${String(count + 1).padStart(prefixCount, "0")}`;
  }

  if (type === "department" && code) {
    const count = await Department.countDocuments({ tenantCode: code });
    return `${initials}-${String(count + 1).padStart(prefixCount, "0")}`;
  }

  if (type === "role") {
    const count = await Roles.countDocuments();
    return `${initials}-${String(count + 1).padStart(prefixCount, "0")}`;
  }

  if (type === "user" && code) {
    const count = await User.countDocuments({ tenantCode: code });
    return `${initials}-${String(count + 1).padStart(prefixCount, "0")}`;
  }
  if (type === "grievance" && code) {
    const lastGrievance = await Grievance.findOne({ tenantCode: code })
      .sort({ createdAt: -1 })
      .select("grievanceCode");

    let nextNumber = 1;

    if (lastGrievance) {
      nextNumber = parseInt(lastGrievance.grievanceCode.split("-")[1]) + 1;
    }

    return `${initials}-${String(nextNumber).padStart(prefixCount, "0")}`;
  }
};

const generateAccessKey = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  const generatePart = (length) => {
    let part = "";
    for (let i = 0; i < length; i++) {
      part += chars[crypto.randomInt(0, chars.length)];
    }
    return part;
  };

  return `${generatePart(4)}-${generatePart(4)}-${generatePart(4)}`;
};

const generateTrackingId = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  const part = () =>
    Array.from(
      { length: 4 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");

  return `TRK-${part()}-${part()}`;
};

module.exports = {
  generateUniqueTenantCode,
  generateAccessKey,
  generateTrackingId,
};
