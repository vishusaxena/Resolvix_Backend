const Grievance = require("../models/Grievance");
const Tenant = require("../models/Tenant");
const User = require("../models/User");

exports.getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find();
    res.json(grievances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGrievanceById = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance)
      return res.status(404).json({ message: "Grievance not found" });

    res.json(grievance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateGrievanceStatus = async (req, res) => {
  try {
    const { status, response } = req.body;
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance)
      return res.status(404).json({ message: "Grievance not found" });

    grievance.status = status || grievance.status;
    grievance.response = response || grievance.response;

    await grievance.save();
    res.json({ message: "Grievance updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteGrievance = async (req, res) => {
  try {
    await Grievance.findByIdAndDelete(req.params.id);
    res.json({ message: "Grievance deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.GetAllGrievancesByDepartment = async (req, res) => {
  try {
    const { tenantCode, userCode } = req.user;

    const user = await User.findOne({
      tenantCode,
      userCode,
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
        data: null,
      });
    }

    const grievances = await Grievance.find({
      tenantCode,
      "grievanceDetails.complaintDepartment.departmentCode": user.department,
      isDeleted: false,
    })
      .select(
        `
        grievanceCode
        grievanceStatus
        grievanceDetails.complaintSubject
        grievanceDetails.complaintPriority
        createdAt
        complaintDetails
        complaintAttachments.url
      `,
      )
      .sort({ createdAt: -1 });

    const formattedGrievances = grievances.map((grievance) => ({
      grievanceId: grievance.grievanceCode,
      title: grievance.grievanceDetails?.complaintSubject,
      priority: grievance.grievanceDetails?.complaintPriority,
      dateRaised: grievance.createdAt,
      status: grievance.grievanceStatus,
      action: grievance._id,
    }));

    const details = await Grievance.find({
      tenantCode,
      "grievanceDetails.complaintDepartment.departmentCode": user.department,
      isDeleted: false,
    });

    return res.status(200).json({
      status: "success",
      message: "Successfully fetched",
      count: formattedGrievances.length,
      data: formattedGrievances,
      viewDetails: details,
      headersKey: [
        "Grievance Id",
        "Title",
        "Priority",
        "Date Raised",
        "Status",
        "Action",
      ],

      filters: [
        {
          key: "priority",
          label: "Priority",
          options: ["High", "Medium", "Low"],
        },
        {
          key: "status",
          label: "Status",
          options: [
            "Filed",
            "Assigned",
            "In Progress",
            "Resolved",
            "Closed",
            "Rejected",
          ],
        },
      ],
    });
  } catch (error) {
    console.error("GetAllGrievancesByDepartment Error:", error);

    return res.status(500).json({
      status: "error",
      message: error.message,
      data: null,
    });
  }
};

exports.AssignGrievance = async (req, res) => {
  const { grievanceCode, tenant, department, assignedTo, assignedCode } =
    req.body;

  const grievance = await Grievance.findOne({
    tenantCode: tenant,
    grievanceCode,
  });

  if (!grievance) {
    return res.status(404).json({
      status: "error",
      message: "Grievance not found",
    });
  }

  grievance.assignedTo = {
    name: assignedTo,
    userCode: assignedCode,
    assignedAt: new Date(),
    email: "",
  };

  grievance.grievanceStatus = "Assigned";

  await grievance.save();

  res.status(200).json({
    status: "success",
    message: "Assigned Successfully",
    data: grievance,
  });
};
