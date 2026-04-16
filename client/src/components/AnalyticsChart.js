import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AnalyticsChart({ transactions, darkMode = false }) {
  // Group by date
  const dataMap = {};

  transactions.forEach((t) => {
    const date = new Date(t.createdAt).toLocaleDateString();

    if (!dataMap[date]) {
      dataMap[date] = { date, deposit: 0, withdraw: 0 };
    }

    if (t.type === "deposit") {
      dataMap[date].deposit += t.amount;
    } else {
      dataMap[date].withdraw += t.amount;
    }
  });

  const data = Object.values(dataMap);

  const textColor = darkMode ? "#e2e8f0" : "#374151";
  const gridColor = darkMode ? "#475569" : "#e5e7eb";

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

          <XAxis
            dataKey="date"
            stroke={textColor}
            fontSize={12}
            tick={{ fill: textColor }}
          />
          <YAxis
            stroke={textColor}
            fontSize={12}
            tick={{ fill: textColor }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? "#1e293b" : "#ffffff",
              border: `1px solid ${darkMode ? "#475569" : "#e5e7eb"}`,
              borderRadius: "8px",
              color: textColor,
            }}
          />

          <Line
            type="monotone"
            dataKey="deposit"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
          />

          <Line
            type="monotone"
            dataKey="withdraw"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}