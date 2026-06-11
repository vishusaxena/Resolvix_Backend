const Tenant = require("../models/Tenant");

const generateUniqueTenantCode = async () => {
  const count = await Tenant.countDocuments();

  return `TNT${String(count + 1).padStart(4, "0")}`;
};

module.exports = {
  generateUniqueTenantCode,
};
