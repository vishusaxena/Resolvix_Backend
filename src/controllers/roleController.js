const Roles = require("../models/roles");
const Tenant = require("../models/Tenant");
const { generateUniqueTenantCode } = require("../utils/services");

const InsertUpdaterole = async (req, res) => {
  try {
    const data = req.body;

    let role = await Roles.findOne({ roleName: data.roleName });

    if (!role) {
      const code = await generateUniqueTenantCode("ROL", 3, "role");
      data.roleCode = code;

      role = new Roles(data);
      await role.save();
    }

    res.status(201).json({
      status: "success",
      message: "role inserted successfully",
      data: role,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message, data: null });
  }
};

const GetAllroles = async (req, res) => {
  try {
    const roles = await Roles.find();
    res.status(200).json({
      status: "success",
      message: "roles fetched successfully",
      data: roles,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message, data: null });
  }
};

const GetroleById = () => {};

module.exports = {
  InsertUpdaterole,
  GetAllroles,
  GetroleById,
};
