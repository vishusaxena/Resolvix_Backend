const Grievance = require("../models/Grievance");
const Feedback = require("../models/Feedback");

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
    const { title, description, category, subcategory } = req.body;
    const newGrievance = new Grievance({
      userId: req.user.id,
      title,
      description,
      category,
      subcategory,
      status: "Pending",
    });

    await newGrievance.save();
    res.status(201).json({ message: "Grievance submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
