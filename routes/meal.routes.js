const router = require("express").Router();
const MealModel = require("../models/Meal.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

router.post("/", isAuthenticated, async (req, res) => {
  try {
    const meal = await MealModel.create({
      ...req.body,
      owner: req.payload._id,
    });

    res.status(201).json(meal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create meal" });
  }
});

router.get("/", async (req, res) => {
  try {
    const meals = await MealModel.find({ status: "available" }).populate(
      "owner",
      "name",
    );
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch meals" });
  }
});

router.get("/:mealId", async (req, res) => {
  try {
    const meal = await MealModel.findById(req.params.mealId).populate(
      "owner",
      "name",
    );

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.status(200).json(meal);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch meal" });
  }
});

router.put("/:mealId", isAuthenticated, async (req, res) => {
  try {
    const meal = await MealModel.findById(req.params.mealId);

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    if (meal.owner.toString() !== req.payload._id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedMeal = await MealModel.findByIdAndUpdate(
      req.params.mealId,
      req.body,
      { new: true },
    );

    res.status(200).json(updatedMeal);
  } catch (error) {
    res.status(500).json({ message: "Failed to update meal" });
  }
});

router.delete("/:mealId", isAuthenticated, async (req, res) => {
  try {
    const meal = await MealModel.findById(req.params.mealId);

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    if (meal.owner.toString() !== req.payload._id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await MealModel.findByIdAndDelete(req.params.mealId);
    res.status(200).json({ message: "Meal deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete meal" });
  }
});

module.exports = router;
