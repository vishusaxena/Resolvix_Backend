const Tenant = require("../models/Tenant");
const { generateUniqueTenantCode } = require("../utils/services");

const InsertUpdateTenant = async (req, res) => {
  try {
    const data = req.body;

    //if already exists, update. Else create new
    let tenant = await Tenant.findOne({ tenantCode: data.tenantCode });

    if (tenant) {
      tenant.tenantName = data.tenantName;
      tenant.tenantType = data.tenantType;
      tenant.tenantPhone = data.tenantPhone;
      tenant.tenantEmail = data.tenantEmail;
      tenant.tenantWebsite = data.tenantWebsite;
      tenant.tenantAddress = data.tenantAddress;
      tenant.tenantStatus = data.tenantStatus;
      await tenant.save();
    } else {
      const generatedCode = await generateUniqueTenantCode("TNT", 4, "tenant");
      data.tenantCode = generatedCode;
      tenant = new Tenant(data);
      await tenant.save();
    }

    res.status(201).json({
      status: "success",
      message: "Tenant inserted/updated successfully",
      data: tenant,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message, data: null });
  }
};

const GetAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.status(200).json({
      status: "success",
      message: "Tenants fetched successfully",
      data: tenants,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message, data: null });
  }
};

const GetTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ tenantCode: req.params.id });
    if (!tenant) {
      return res
        .status(404)
        .json({ status: "error", message: "Tenant not found", data: null });
    }
    res.status(200).json({
      status: "success",
      message: "Tenant fetched successfully",
      data: tenant,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message, data: null });
  }
};

module.exports = {
  InsertUpdateTenant,
  GetAllTenants,
  GetTenantById,
};
