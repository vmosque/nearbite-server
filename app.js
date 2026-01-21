// ℹ️ Gets access to environment variables/settings
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests
const express = require("express");
const app = express();

// ℹ️ Security headers
const helmet = require("helmet");
app.use(helmet());

// ℹ️ Middlewares
require("./config")(app);

// 👇 Routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const mealRoutes = require("./routes/meal.routes");
app.use("/api/meals", mealRoutes);

const reservationRoutes = require("./routes/reservation.routes");
app.use("/api/reservations", reservationRoutes);

// ❗ Error handling
require("./error-handling")(app);

module.exports = app;
