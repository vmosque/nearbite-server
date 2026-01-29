const { Schema, model } = require("mongoose");

const mealSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    portions: {
      type: Number,
      required: true,
      min: 1,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    pickupFrom: String,
    pickupTo: String,

    location: {
      type: String,
      required: true,
    },

    dietary: {
      type: [String],
      default: [],
    },

    allergens: {
      type: [String],
      default: [],
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
