export default function Sidebar({ active, setActive }) {
  const menuItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "transactions", icon: "💳", label: "Transactions" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-24 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-lg z-10">
      <div className="flex flex-col items-center py-8 space-y-2">
        {/* Logo */}
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-8 shadow-lg">
          C
        </div>

        {/* Menu Items */}
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 transform hover:scale-110 ${
              active === item.id
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </aside>
  );
}