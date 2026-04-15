const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

/* 🔐 REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!email || !phone || !password) {
      return res.status(400).json({
        msg: "Email, phone & password are required",
      });
    }

    const existing = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    /* 💳 CARD GENERATION */
    const cardNumber =
      "4000 " +
      Math.floor(1000 + Math.random() * 9000) +
      " " +
      Math.floor(1000 + Math.random() * 9000) +
      " " +
      Math.floor(1000 + Math.random() * 9000);

    const cvv = Math.floor(100 + Math.random() * 900).toString();

    const expiry = `${Math.floor(Math.random() * 12 + 1)
      .toString()
      .padStart(2, "0")}/${Math.floor(Math.random() * 5 + 26)}`;

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      cardNumber,
      expiry,
      cvv,
      balance: 0,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/* 🔐 LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ msg: "Enter credentials" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/* 👤 GET USER */
router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

/* ✏️ UPDATE PROFILE */
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        msg: "All fields required",
      });
    }

    const existing = await User.findOne({
      $or: [{ email }, { phone }],
      _id: { $ne: req.user.id },
    });

    if (existing) {
      return res.status(400).json({
        msg: "Email or phone already used",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;