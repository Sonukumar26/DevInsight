require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");

const connectDB = require("./config/db");
const passport = require("./config/passport");

const metricsRoutes = require("./routes/metrics.routes");
const authRoutes = require("./routes/auth.routes");
const analysisRoutes = require("./routes/analysis.routes");
const codeReviewRoutes = require("./routes/codeReview.routes");
const apiMonitoringMiddleware =
  require("./middleware/apiMonitor");
  
const app = express();

// DB
connectDB();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Monitoring
app.use(apiMonitoringMiddleware);

app.use(session({
  secret: process.env.SESSION_SECRET || "devinsightsecret",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/metrics", metricsRoutes);
app.use("/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/code-review", codeReviewRoutes);

// Health
app.get("/", (req, res) => {
  res.json({ message: "API Running 🚀" });
});

module.exports = app;