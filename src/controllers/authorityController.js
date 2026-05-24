const axios = require("axios");
const Grievance = require("../models/Grievance");
const nodemailer = require("nodemailer");

exports.getAssignedGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ assignedTo: req.user.id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(grievances);
  } catch (err) {
    console.error("Error fetching grievances:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resolveGrievance = async (req, res) => {
  try {
    const { response } = req.body;
    const grievance = await Grievance.findById(req.params.id).populate(
      "userId",
      "email name"
    );

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    if (grievance.assignedTo.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to resolve this grievance" });
    }

    grievance.status = "Resolved";
    grievance.response = response;
    grievance.updatedAt = Date.now();
    await grievance.save();
    if (grievance.userId?.email) {
      try {
        console.log("Attempting to send email...");
        await exports.sendResolutionEmail(
          grievance.userId.email,
          "Your Grievance Has Been Resolved",
          `Hello ${grievance.userId.name},\n\nYour grievance titled "${grievance.title}" has been resolved.\nResponse: ${response}\n\nThank you!`
        );
        console.log("Email sent successfully.");
      } catch (emailError) {
        console.error(
          "Failed to send email:",
          emailError.response?.data || emailError.message
        );
      }
    }
    res.json({
      message: "Grievance resolved successfully! Email status unknown.",
    });
  } catch (err) {
    console.error("Error resolving grievance:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server error" });
    }
  }
};

exports.sendResolutionEmail = async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res
      .status(400)
      .json({ error: "Missing email, subject, or message in request body" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"GMS Authority" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", email);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Email sending failed" });
  }
};
