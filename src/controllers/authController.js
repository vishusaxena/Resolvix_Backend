const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tenant = require("../models/Tenant");
const { generateUniqueTenantCode } = require("../utils/services");

exports.registerUser = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    //if a tenant already have that department then update. Else create new
    let tenant = await Tenant.findOne({ tenantCode: data.tenantCode });
    let user = await User.findOne({
      tenantCode: data.tenantCode,
      userCode: data.userCode,
    });

    if (tenant && user) {
      user.name = data.name;
      user.email = data.email;
      user.role = data.role;
      user.password = data.password;
      user.department = data.department;
      user.isActive = data.isActive;
      await user.save();
    } else {
      const generatedCode = await generateUniqueTenantCode(
        "USR",
        3,
        "user",
        data.tenantCode,
      );
      data.userCode = generatedCode;
      user = new User(data);
      await user.save();
    }

    res.status(201).json({
      status: "success",
      message: "user inserted/updated successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message, data: null });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = password === user.password;
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error in loginUser:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error in getProfile:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.GetAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      tenantCode: req.params.id,
    });
    res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message, data: null });
  }
};
