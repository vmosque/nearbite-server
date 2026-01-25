const { Schema, model } = require("mongoose");

const reservationSchema = new Schema(
  {
    meal: {
      type: Schema.Types.ObjectId,
      ref: "Meal",
      required: true,
    },

    reservedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model("Reservation", reservationSchema);
