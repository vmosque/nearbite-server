const router = require("express").Router();
const ReservationModel = require("../models/Reservation.model");
const MealModel = require("../models/Meal.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

/*
|--------------------------------------------------------------------------
| 1️⃣ CREATE A RESERVATION
|--------------------------------------------------------------------------
| POST /api/reservations/:mealId
| - Only logged-in users
| - Cannot reserve your own meal
| - Meal status changes to "reserved"
*/
router.post("/:mealId", isAuthenticated, async (req, res) => {
  const { mealId } = req.params;
  const userId = req.payload._id;

  try {
    const meal = await MealModel.findById(mealId);

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found",
      });
    }

    // Cannot reserve your own meal
    if (meal.owner.toString() === userId) {
      return res.status(403).json({
        message: "You cannot reserve your own meal",
      });
    }

    // Meal already reserved
    if (meal.status === "reserved") {
      return res.status(400).json({
        message: "Meal is already reserved",
      });
    }

    // Create reservation
    const reservation = await ReservationModel.create({
      meal: mealId,
      reservedBy: userId,
    });

    // Update meal status
    meal.status = "reserved";
    await meal.save();

    res.status(201).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create reservation",
    });
  }
});

/*
|--------------------------------------------------------------------------
| 2️⃣ GET MY RESERVATIONS
|--------------------------------------------------------------------------
| GET /api/reservations/my
| - Only logged-in users
| - Shows reservations made by the user
*/
router.get("/my", isAuthenticated, async (req, res) => {
  try {
    const reservations = await ReservationModel.find({
      reservedBy: req.payload._id,
    })
      .populate("meal")
      .populate("reservedBy", "name");

    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch reservations",
    });
  }
});

module.exports = router;
