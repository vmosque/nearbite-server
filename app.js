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

// CORS
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// ℹ️ Middlewares
require("./config")(app);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "NearBite API",
  });
});

// 👇 Routes
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const mealRoutes = require("./routes/meal.routes");
app.use("/api/meals", mealRoutes);

const reservationRoutes = require("./routes/reservation.routes");
app.use("/api/reservations", reservationRoutes);

// ❗ Error handling
require("./error-handling")(app);

module.exports = app;
