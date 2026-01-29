const { Schema, model } = require("mongoose");

const reservationSchema = new Schema(
  {
    meal: {
      type: Schema.Types.ObjectId,
      ref: "Meal",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = model("Reservation", reservationSchema);
