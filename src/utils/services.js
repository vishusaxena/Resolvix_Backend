const Department = require("../models/Department");
const Roles = require("../models/roles");
const Tenant = require("../models/Tenant");
const User = require("../models/User");

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
};

module.exports = {
  generateUniqueTenantCode,
};
