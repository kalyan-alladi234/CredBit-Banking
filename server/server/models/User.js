const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,

    balance: {
      type: Number,
      default: 0,
    },

    // 💳 CARD DETAILS
    cardNumber: String,
    expiry: String,
    cvv: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);