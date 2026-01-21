const router = require("express").Router();
const MealModel = require("../models/Meal.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

/*
|--------------------------------------------------------------------------
| 1️⃣ CREATE A MEAL
|--------------------------------------------------------------------------
| POST /api/meals
| - Only logged-in users
| - The logged-in user becomes the owner of the meal
*/
router.post("/", isAuthenticated, async (req, res) => {
  const { title, description, portions, expiresAt } = req.body;

  // Basic validation
  if (!title || !description || !portions || !expiresAt) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const newMeal = await MealModel.create({
      title,
      description,
      portions,
      expiresAt,
      owner: req.payload._id, // comes from JWT middleware
    });

    res.status(201).json(newMeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create meal",
    });
  }
});

/*
|--------------------------------------------------------------------------
| 2️⃣ GET ALL AVAILABLE MEALS
|--------------------------------------------------------------------------
| GET /api/meals
| - Public route
| - Only meals with status "available"
*/
router.get("/", async (req, res) => {
  try {
    const meals = await MealModel.find({ status: "available" }).populate(
      "owner",
      "name",
    );

    res.status(200).json(meals);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch meals",
    });
  }
});

/*
|--------------------------------------------------------------------------
| 3️⃣ GET MEAL DETAILS
|--------------------------------------------------------------------------
| GET /api/meals/:mealId
| - Public route
| - Get one meal by ID
*/
router.get("/:mealId", async (req, res) => {
  const { mealId } = req.params;

  try {
    const meal = await MealModel.findById(mealId).populate("owner", "name");

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found",
      });
    }

    res.status(200).json(meal);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch meal",
    });
  }
});

/*
|--------------------------------------------------------------------------
| 4️⃣ UPDATE A MEAL
|--------------------------------------------------------------------------
| PUT /api/meals/:mealId
| - Only logged-in users
| - Only the owner can update the meal
*/
router.put("/:mealId", isAuthenticated, async (req, res) => {
  const { mealId } = req.params;

  try {
    const meal = await MealModel.findById(mealId);

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found",
      });
    }

    // Authorization: only owner can edit
    if (meal.owner.toString() !== req.payload._id) {
      return res.status(403).json({
        message: "You are not allowed to edit this meal",
      });
    }

    const updatedMeal = await MealModel.findByIdAndUpdate(mealId, req.body, {
      new: true,
    });

    res.status(200).json(updatedMeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update meal",
    });
  }
});

/*
|--------------------------------------------------------------------------
| 5️⃣ DELETE A MEAL
|--------------------------------------------------------------------------
| DELETE /api/meals/:mealId
| - Only logged-in users
| - Only the owner can delete the meal
*/
router.delete("/:mealId", isAuthenticated, async (req, res) => {
  const { mealId } = req.params;

  try {
    const meal = await MealModel.findById(mealId);

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found",
      });
    }

    // Authorization: only owner can delete
    if (meal.owner.toString() !== req.payload._id) {
      return res.status(403).json({
        message: "You are not allowed to delete this meal",
      });
    }

    await MealModel.findByIdAndDelete(mealId);

    res.status(200).json({
      message: "Meal deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete meal",
    });
  }
});

module.exports = router;
