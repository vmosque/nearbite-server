const { Schema, model } = require("mongoose");

const mealSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Meal title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Meal description is required"],
    },

    portions: {
      type: Number,
      required: [true, "Number of portions is required"],
      min: 1,
    },

    expiresAt: {
      type: Date,
      required: [true, "Expiration date is required"],
    },

    status: {
      type: String,
      enum: ["available", "reserved"],
      default: "available",
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model("Meal", mealSchema);
