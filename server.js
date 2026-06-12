const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/grievances", require("./src/routes/grievanceRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/authority", require("./src/routes/authorityRoutes"));
app.use("/api/notifications", require("./src/routes/notificationRoutes"));
app.use("/api", require("./src/routes/tenantRoutes"));
app.use("/api", require("./src/routes/departmentRoutes"));
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
