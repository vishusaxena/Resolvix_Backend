const Grievance = require("../models/Grievance");

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
