const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔥 CARD GENERATORS
const generateCardNumber = () => {
  return Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
};

const generateExpDate = () => {
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const year = new Date().getFullYear() + 3;
  return `${month}/${year.toString().slice(-2)}`;
};

const generateCVV = () => {
  return String(Math.floor(100 + Math.random() * 900));
};

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,

    cardNumber: generateCardNumber(),
    exp: generateExpDate(),
    cvv: generateCVV()
  });

  res.json(user);
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json("Invalid credentials");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ token });
};