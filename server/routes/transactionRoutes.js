const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { deposit, withdraw, getTransactions, send } = require("../controllers/transactionController");

/* 📊 GET ALL */
router.get("/", auth, getTransactions);

/* 💰 DEPOSIT */
router.post("/deposit", auth, deposit);

/* 💸 WITHDRAW */
router.post("/withdraw", auth, withdraw);

/* 💳 SEND */
router.post("/send", auth, send);

module.exports = router;