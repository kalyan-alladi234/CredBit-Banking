import { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CardUI from "../components/CardUI";
import StatsCard from "../components/StatsCard";
import AnalyticsChart from "../components/AnalyticsChart";
import PieChartUI from "../components/PieChartUI";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import jsPDF from "jspdf";

export default function Dashboard() {
  const { user, loading, refreshUser } = useContext(AuthContext);

  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [active, setActive] = useState("dashboard");
  const [identifier, setIdentifier] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sendError, setSendError] = useState("");

  // 🔥 PROFILE STATES
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  /* 📊 FETCH */
  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  /* 💰 DEPOSIT */
  const deposit = async () => {
    if (!amount) return alert("Enter amount");
    try {
      await api.post("/transactions/deposit", { amount: Number(amount) });
      alert("✅ Deposit successful");
      setAmount("");
      refreshUser();
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  /* 💸 WITHDRAW */
  const withdraw = async () => {
    if (!amount) return alert("Enter amount");
    try {
      await api.post("/transactions/withdraw", { amount: Number(amount) });
      alert("💸 Withdraw successful");
      setAmount("");
      refreshUser();
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  /* 💳 SEND */
  const sendMoney = async () => {
    if (!identifier || !amount) {
      setSendError("Enter receiver & amount");
      return;
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();
    const ownEmail = user?.email?.trim().toLowerCase();
    const ownPhone = user?.phone?.replace(/\D/g, "");
    const inputPhone = identifier.replace(/\D/g, "");

    if (
      normalizedIdentifier === ownEmail ||
      (ownPhone && inputPhone && ownPhone === inputPhone)
    ) {
      setSendError("You cannot send money to your own email or phone number.");
      return;
    }

    try {
      setSendError("");
      await api.post("/transactions/send", { identifier, amount: Number(amount) });
      alert("💸 Money sent");
      setAmount("");
      setIdentifier("");
      refreshUser();
      fetchTransactions();
    } catch (err) {
      setSendError(err.response?.data?.msg || "Send failed");
    }
  };

  /* ✏️ UPDATE PROFILE */
  const updateProfile = async () => {
    if (!name || !email || !phone) return alert("All fields required");
    try {
      await api.put("/auth/update", { name, email, phone });
      alert("✅ Profile updated");
      setEditMode(false);
      refreshUser();
    } catch (err) {
      alert(err.response?.data?.msg || "Update failed");
    }
  };

  /* 📄 PDF */
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Transaction Statement", 20, 20);
    let y = 40;
    transactions.forEach((t) => {
      doc.text(`${t.type} - ₹${t.amount}`, 20, y);
      y += 10;
    });
    doc.save("transactions.pdf");
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
      </div>
    </div>
  );
  if (!user) return <h2>Please login</h2>;

  const income = transactions.filter(t => t.type === "deposit").reduce((a, b) => a + b.amount, 0);
  const spending = transactions.filter(t => t.type !== "deposit").reduce((a, b) => a + b.amount, 0);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}>
      <Sidebar active={active} setActive={setActive} />

      <div className="ml-24 min-h-screen">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <div className="p-8 space-y-8">
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Total Balance"
                amount={user.balance}
                subtitle="Available funds"
                variant="primary"
                icon="💰"
              />
              <StatsCard
                title="Monthly Income"
                amount={income}
                subtitle="This month"
                variant="accent"
                icon="📈"
              />
              <StatsCard
                title="Monthly Spending"
                amount={spending}
                subtitle="This month"
                variant="default"
                icon="💸"
              />
            </div>

            {/* CARD & ACTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <CardUI user={user} />
              </div>

              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Quick Actions</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
                    <input
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setSendError("");
                      }}
                      className="w-full p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recipient</label>
                    <input
                      placeholder="Email or Phone"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        setSendError("");
                      }}
                      className="w-full p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all text-lg"
                    />
                    {sendError && (
                      <p className="mt-3 text-sm text-red-600 dark:text-red-400">{sendError}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={deposit}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 hover:shadow-xl shadow-lg"
                  >
                    💰 Deposit
                  </button>
                  <button
                    onClick={withdraw}
                    className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white p-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 hover:shadow-xl shadow-lg"
                  >
                    💸 Withdraw
                  </button>
                  <button
                    onClick={sendMoney}
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white p-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 hover:shadow-xl shadow-lg"
                  >
                    📤 Send Money
                  </button>
                </div>
              </div>
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Financial Analytics</h3>
                <AnalyticsChart transactions={transactions} darkMode={darkMode} />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Spending Breakdown</h3>
                <PieChartUI transactions={transactions} darkMode={darkMode} />
              </div>
            </div>
          </div>
        )}

        {/* TRANSACTIONS */}
        {active === "transactions" && (
          <div className="p-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Transaction History</h2>
                <button
                  onClick={downloadPDF}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg"
                >
                  📄 Download PDF
                </button>
              </div>

              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-xl text-gray-500 dark:text-gray-400">No transactions yet</p>
                    <p className="text-gray-400 dark:text-gray-500">Your transaction history will appear here</p>
                  </div>
                ) : (
                  transactions.map((t, index) => (
                    <div
                      key={t._id}
                      className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center space-x-6">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg ${
                          t.type === "deposit" ? "bg-gradient-to-br from-emerald-400 to-emerald-600" :
                          t.type === "transfer" ? "bg-gradient-to-br from-indigo-400 to-indigo-600" :
                          "bg-gradient-to-br from-rose-400 to-rose-600"
                        }`}>
                          {t.type === "deposit" ? "↓" : t.type === "transfer" ? "→" : "↑"}
                        </div>
                        <div>
                          <p className="font-bold text-xl text-gray-900 dark:text-white">
                            {t.type === "deposit" ? "Money Received" : t.type === "transfer" ? "Money Sent" : "Money Withdrawn"}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400">
                            {new Date(t.createdAt).toLocaleDateString()} • {new Date(t.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-2xl ${t.type === "deposit" ? "text-emerald-600" : "text-rose-600"}`}>
                          {t.type === "deposit" ? "+" : "-"}₹{t.amount}
                        </p>
                        <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded-full text-sm font-medium">
                          ✓ Completed
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {active === "profile" && (
          <div className="p-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-2xl border border-gray-100 dark:border-gray-700">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">CredBit Account Holder</p>
              </div>

              {editMode ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Full Name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Email Address</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Phone Number</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Account Balance</label>
                      <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 border-2 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-lg font-bold">
                        ₹{user.balance}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4 pt-6">
                    <button
                      onClick={updateProfile}
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white p-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
                    >
                      💾 Save Changes
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-lg transition-all hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-6 rounded-2xl border border-blue-200 dark:border-blue-700">
                      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Full Name</h3>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{user.name}</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-6 rounded-2xl border border-green-200 dark:border-green-700">
                      <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">Account Balance</h3>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">₹{user.balance}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-6 rounded-2xl border border-purple-200 dark:border-purple-700">
                      <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">Email Address</h3>
                      <p className="text-xl font-medium text-purple-900 dark:text-purple-100">{user.email}</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 p-6 rounded-2xl border border-orange-200 dark:border-orange-700">
                      <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-2">Phone Number</h3>
                      <p className="text-xl font-medium text-orange-900 dark:text-orange-100">{user.phone}</p>
                    </div>
                  </div>
                  <div className="pt-6">
                    <button
                      onClick={() => setEditMode(true)}
                      className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white p-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
                    >
                      ✏️ Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}