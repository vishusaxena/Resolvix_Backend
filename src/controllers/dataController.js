const Department = require("../models/Department");
const Roles = require("../models/roles");
const User = require("../models/User");

const getDataOptions = async (req, res) => {
  try {
    const { type, tenantId } = req.query;

    // 1. Validation guard clause
    if (type && type !== "roles" && type !== "departments") {
      return res.status(400).json({
        success: false,
        error: "Invalid 'type'. Must be either 'roles' or 'departments'.",
      });
    }

    let records = [];

    // 2. Fetch data dynamically based on the type
    if (type === "roles") {
      // Roles are global - do not pass a tenant filter
      records = await Roles.find({}).select("roleCode roleName").lean();
    } else if (type === "departments") {
      // Departments are tenant-specific
      const query = {};
      if (tenantId) query.tenantCode = tenantId;

      records = await Department.find(query)
        .select("departmentCode departmentName")
        .lean();
    } else {
      // Fallback: If no type is passed, fetch from both paths accordingly
      const deptQuery = tenantId ? { departmentCode: tenantId } : {};

      const [fetchedRoles, fetchedDepts] = await Promise.all([
        Roles.find({}).select("roleCode roleName").lean(), // Global roles
        Department.find(deptQuery)
          .select("departmentCode departmentName")
          .lean(), // Tenant depts
      ]);

      records = [...fetchedRoles, ...fetchedDepts];
    }

    // 3. Normalize the final response payload structure to: { code, name }
    const responseData = records.map((item) => {
      const code = item.roleCode || item.departmentCode || "";
      const name = item.roleName || item.departmentName || "Unnamed";

      return {
        code: code,
        name: name,
      };
    });

    return res.status(200).json({
      success: true,
      count: responseData.length,
      data: responseData,
    });
  } catch (error) {
    console.error("Error in getDataOptions controller:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

const getGrievanceOfficers = async (req, res) => {
  const { department, tenantId } = req.query;
  const officers = await User.find({
    department,
    tenantCode: tenantId,
    role: "Grievance Officer",
  });

  res.status(200).json({
    status: "success",
    data: officers,
    message: "Officers fetched Successfully",
  });
};

module.exports = {
  getDataOptions,
  getGrievanceOfficers,
};
