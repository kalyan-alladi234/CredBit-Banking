const Transaction = require("../models/Transaction");
const User = require("../models/User");

const deposit = async (req, res) => {
  const { amount } = req.body;

  // 🚨 Validation
  if (!amount || amount <= 0) {
    return res.status(400).json({ msg: "Amount must be greater than 0" });
  }

  const user = await User.findById(req.user.id);

  user.balance += amount;
  await user.save();

  await Transaction.create({
    user: user._id,
    type: "deposit",
    amount
  });

  res.json({ msg: "Deposit successful", balance: user.balance });
};

const withdraw = async (req, res) => {
  const { amount } = req.body;

  // 🚨 Validation
  if (!amount || amount <= 0) {
    return res.status(400).json({ msg: "Amount must be greater than 0" });
  }

  const user = await User.findById(req.user.id);

  if (user.balance < amount) {
    return res.status(400).json({ msg: "Insufficient balance" });
  }

  user.balance -= amount;
  await user.save();

  await Transaction.create({
    user: user._id,
    type: "withdraw",
    amount
  });

  res.json({ msg: "Withdraw successful", balance: user.balance });
};

exports.getTransactions = async (req, res) => {
  const tx = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(tx);
};

exports.send = async (req, res) => {
  try {
    const { identifier, amount } = req.body;

    if (!identifier || !amount) {
      return res.status(400).json({ msg: "Enter receiver & amount" });
    }

    const sender = await User.findById(req.user.id);

    if (sender.balance < amount) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    let receiver;
    if (identifier.includes("@")) {
      receiver = await User.findOne({ email: identifier });
    } else {
      receiver = await User.findOne({ phone: identifier });
    }

    if (!receiver) {
      return res.status(400).json({ msg: "Receiver not found" });
    }

    if (receiver._id.toString() === sender._id.toString()) {
      return res.status(400).json({ msg: "You cannot send to yourself" });
    }

    sender.balance -= Number(amount);
    receiver.balance += Number(amount);

    await sender.save();
    await receiver.save();

    await Transaction.create({
      user: sender._id,
      type: "send",
      amount,
    });

    await Transaction.create({
      user: receiver._id,
      type: "received",
      amount,
    });

    res.json({ msg: "Money sent successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};