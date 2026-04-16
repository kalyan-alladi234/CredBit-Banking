const colorMap = {
  default: "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700",
  primary: "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white",
  accent: "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white",
};

export default function StatsCard({ title, amount, subtitle, variant = "default", icon, className = "" }) {
  return (
    <div className={`rounded-2xl p-6 shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-105 ${colorMap[variant] || colorMap.default} ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium opacity-80">{title}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <h2 className="text-3xl font-bold mb-2">₹{amount}</h2>
      {subtitle && <p className="text-sm opacity-70">{subtitle}</p>}
    </div>
  );
}