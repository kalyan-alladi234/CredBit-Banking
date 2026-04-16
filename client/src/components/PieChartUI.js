import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function PieChartUI({ transactions, darkMode = false }) {
  const dataMap = {};

  transactions.forEach((t) => {
    if (t.type === "withdraw" || t.type === "transfer") {
      const category = t.type === "transfer" ? "transfers" : (t.category || "other");
      dataMap[category] = (dataMap[category] || 0) + t.amount;
    }
  });

  const data = Object.keys(dataMap).map((k) => ({
    name: k.charAt(0).toUpperCase() + k.slice(1),
    value: dataMap[k],
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
            innerRadius={40}
            paddingAngle={2}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? "#1e293b" : "#ffffff",
              border: `1px solid ${darkMode ? "#475569" : "#e5e7eb"}`,
              borderRadius: "8px",
              color: darkMode ? "#e2e8f0" : "#374151",
            }}
            formatter={(value) => [`₹${value}`, "Amount"]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}