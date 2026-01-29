// ℹ️ Gets access to environment variables/settings
require("dotenv").config();

const cors = require("cors");

// ℹ️ Connects to the database
require("./db");

// Handles http requests
const express = require("express");
const app = express();

// ℹ️ Security headers
const helmet = require("helmet");
app.use(helmet());

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://nearbite.netlify.app"],
    credentials: true,
  }),
);

// ℹ️ Middlewares
require("./config")(app);

//  HEALTH CHECK (DEPLOY TEST)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "DEPLOY_TEST_OK",
    service: "NearBite API",
    timestamp: new Date().toISOString(),
  });
});

// 👇 Routes
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const mealRoutes = require("./routes/meal.routes");
app.use("/api/meals", mealRoutes);

const reservationRoutes = require("./routes/reservation.routes");
app.use("/api/reservations", reservationRoutes);

require("./error-handling")(app);

module.exports = app;
