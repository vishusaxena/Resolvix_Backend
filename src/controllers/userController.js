const Grievance = require("../models/Grievance");
const Feedback = require("../models/Feedback");
const Tenant = require("../models/Tenant");
const {
  generateUniqueTenantCode,
  generateTrackingId,
  generateAccessKey,
} = require("../utils/services");
const uploadToCloudinary = require("../utils/cloudinaryUpload");

exports.getUserGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ userId: req.user.id });
    res.json(grievances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitGrievance = async (req, res) => {
  try {
    const data = req.body;
    const tenantCode = req.params.id;

    const tenantExists = await Tenant.findOne({
      tenantCode,
    });

    if (!tenantExists) {
      return res.status(404).json({
        status: "error",
        message: "Tenant not found",
        data: null,
      });
    }

    let uploadedAttachments = [];

    if (data.complaintAttachments?.length) {
      uploadedAttachments = await uploadToCloudinary(data.complaintAttachments);
    }

    const grievanceCode = await generateUniqueTenantCode(
      "GNV",
      3,
      "grievance",
      tenantCode,
    );

    let trackingCode;
    let exists = true;

    while (exists) {
      trackingCode = generateTrackingId();

      exists = await Grievance.exists({
        trackingId: trackingCode,
      });
    }

    const accessKey = generateAccessKey();

    const grievance = new Grievance({
      grievanceCode,
      tenantCode,
      trackingId: trackingCode,
      accessKey,
      grievanceDetails: {
        ...data,
        complaintAttachments: uploadedAttachments,
      },
    });

    await grievance.save();

    return res.status(201).json({
      status: "success",
      message: "Grievance created successfully",
      data: grievance,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
      data: null,
    });
  }
};

exports.closeGrievance = async (req, res) => {
  await Grievance.findByIdAndUpdate(req.params.id, { status: "Closed" });
  res.json({ message: "Grievance closed" });
};

exports.resubmitGrievance = async (req, res) => {
  const { grievanceId, comment } = req.body;
  const grievance = await Grievance.findById(grievanceId);

  if (grievance) {
    await Feedback.create({ userId: grievance.userId, grievanceId, comment });
    grievance.status = "Pending";
    await grievance.save();
    res.json({ message: "Grievance resubmitted" });
  } else {
    res.status(404).json({ error: "Grievance not found" });
  }
};

exports.deleteGrievance = async (req, res) => {
  await Grievance.findByIdAndDelete(req.params.id);
  res.json({ message: "Grievance deleted" });
};
