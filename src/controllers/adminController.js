const User = require("../models/User");
const Grievance = require("../models/Grievance");
const mongoose = require("mongoose");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAllAuthorities = async (req, res) => {
  try {
    const authorities = await User.find({ role: "authority" }).select(
      "-password"
    );
    res.json(authorities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching authorities", error });
  }
};

exports.assignGrievance = async (req, res) => {
  try {
    const { authorityId } = req.body;
    const grievance = await Grievance.findById(req.params.grievanceId);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    grievance.assignedTo = authorityId;
    grievance.status = "In Progress";

    await grievance.save();
    res.json({ message: "Grievance assigned successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.closeGrievance = async (req, res) => {
  const { grievanceId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(grievanceId)) {
    return res.status(400).json({ message: "Invalid grievance ID" });
  }

  try {
    const grievance = await Grievance.findById(grievanceId);
    console.log(grievance);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    if (grievance.status !== "Resolved") {
      return res
        .status(400)
        .json({ message: "Grievance must be resolved before closing" });
    }

    grievance.status = "Closed";
    await grievance.save();

    res.json({ message: "Grievance closed successfully" });
  } catch (err) {
    console.log(err.message);

    res
      .status(500)
      .json({ message: "Error closing grievance", error: err.message });
  }
};
