const Transaction = require("../models/Transaction");
const User = require("../models/User");

const deposit = async (req, res) => {
  try {
    const { amount } = req.body;
    const amt = Number(amount);

    if (!amount || isNaN(amt) || amt <= 0) {
      return res.status(400).json({ msg: "Amount must be greater than 0" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.balance += amt;
    await user.save();

    await Transaction.create({
      user: user._id,
      type: "deposit",
      amount: amt,
    });

    res.json({
      msg: "Deposit successful",
      balance: user.balance,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const withdraw = async (req, res) => {
  try {
    const { amount } = req.body;
    const amt = Number(amount);

    if (!amount || isNaN(amt) || amt <= 0) {
      return res.status(400).json({ msg: "Amount must be greater than 0" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.balance < amt) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    user.balance -= amt;
    await user.save();

    await Transaction.create({
      user: user._id,
      type: "withdraw",
      amount: amt,
    });

    res.json({
      msg: "Withdraw successful",
      balance: user.balance,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const tx = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tx);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const send = async (req, res) => {
  try {
    const { identifier, amount } = req.body;
    const amt = Number(amount);

    if (!identifier || !amount || isNaN(amt) || amt <= 0) {
      return res.status(400).json({ msg: "Valid receiver and amount greater than 0 are required" });
    }

    const sender = await User.findById(req.user.id);

    if (!sender) {
      return res.status(404).json({ msg: "Sender not found" });
    }

    if (sender.balance < amt) {
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
      return res.status(400).json({ msg: "You cannot send money to yourself" });
    }

    sender.balance -= amt;
    receiver.balance += amt;

    await sender.save();
    await receiver.save();

    await Transaction.create({
      user: sender._id,
      type: "send",
      amount: amt,
    });

    await Transaction.create({
      user: receiver._id,
      type: "received",
      amount: amt,
    });

    res.json({
      msg: "Money sent successfully",
      senderBalance: sender.balance,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  deposit,
  withdraw,
  getTransactions,
  send,
};