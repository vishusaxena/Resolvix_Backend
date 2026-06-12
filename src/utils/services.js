const Tenant = require("../models/Tenant");

const generateUniqueTenantCode = async (initials, prefixCount) => {
  const count = await Tenant.countDocuments();

  return `${initials}-${String(count + 1).padStart(prefixCount, "0")}`;
};

module.exports = {
  generateUniqueTenantCode,
};
