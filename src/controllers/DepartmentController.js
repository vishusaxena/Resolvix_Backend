const Department = require("../models/Department");
const Tenant = require("../models/Tenant");
const { generateUniqueTenantCode } = require("../utils/services");

const InsertUpdateDepartment = async (req, res) => {
  try {
    const data = req.body;

    //if a tenant already have that department then update. Else create new
    let tenant = await Tenant.findOne({ tenantCode: data.tenantCode });
    let department = await Department.findOne({
      tenantCode: data.tenantCode,
      departmentCode: data.departmentCode,
    });

    if (tenant && department) {
      department.departmentName = data.departmentName;
      department.departmentStatus = data.departmentStatus;
      await department.save();
    } else {
      const generatedCode = await generateUniqueTenantCode(
        "DEP",
        3,
        "department",
        data.tenantCode,
      );
      data.departmentCode = generatedCode;
      data.tenantCode = data.tenantCode;
      department = new Department(data);
      await department.save();
    }

    res.status(201).json({
      status: "success",
      message: "Department inserted/updated successfully",
      data: department,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message, data: null });
  }
};

const GetAllDepartments = async (req, res) => {
  try {
    console.log("Fetching departments for tenant:", req.params.id);
    const departments = await Department.find({
      tenantCode: req.params.id,
    });
    res.status(200).json({
      status: "success",
      message: "Departments fetched successfully",
      data: departments,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message, data: null });
  }
};

const GetDepartmentById = async (req, res) => {
  try {
    const department = await Department.findOne({
      departmentCode: req.params.id,
    });
    if (!department) {
      return res
        .status(404)
        .json({ status: "error", message: "Department not found", data: null });
    }
    res.status(200).json({
      status: "success",
      message: "Department fetched successfully",
      data: department,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message, data: null });
  }
};

module.exports = {
  InsertUpdateDepartment,
  GetAllDepartments,
  GetDepartmentById,
};
