const router = require("express").Router();
const Reservation = require("../models/Reservation.model");
const Meal = require("../models/Meal.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

/* =====================================
   GET MY RESERVATIONS (I reserved)
   GET /api/reservations/my
===================================== */
router.get("/my", isAuthenticated, async (req, res) => {
  try {
    const reservations = await Reservation.find({
      user: req.payload._id,
    }).populate({
      path: "meal",
      populate: {
        path: "owner",
        select: "email name",
      },
    });

    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch reservations" });
  }
});

/* =====================================
   GET RESERVATIONS ON MY MEALS (owner)
   GET /api/reservations/for-my-meals
===================================== */
router.get("/for-my-meals", isAuthenticated, async (req, res) => {
  try {
    const myMeals = await Meal.find({
      owner: req.payload._id,
    }).select("_id");

    const reservations = await Reservation.find({
      meal: { $in: myMeals },
    }).populate([
      { path: "meal", select: "title image" },
      { path: "user", select: "email name" },
    ]);

    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch reservations" });
  }
});

/* =====================================
   RESERVE A MEAL
   POST /api/reservations/:mealId
===================================== */
router.post("/:mealId", isAuthenticated, async (req, res) => {
  try {
    const reservation = await Reservation.create({
      meal: req.params.mealId,
      user: req.payload._id,
    });

    await Meal.findByIdAndUpdate(req.params.mealId, {
      status: "reserved",
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Reservation failed" });
  }
});

/* =====================================
   CANCEL RESERVATION
   DELETE /api/reservations/:reservationId
===================================== */
router.delete("/:reservationId", isAuthenticated, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.reservationId);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.user.toString() !== req.payload._id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Meal.findByIdAndUpdate(reservation.meal, {
      status: "available",
    });

    await Reservation.findByIdAndDelete(req.params.reservationId);

    res.status(200).json({ message: "Reservation cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to cancel reservation" });
  }
});

module.exports = router;
