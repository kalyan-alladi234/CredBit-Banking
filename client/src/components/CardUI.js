import { useState } from "react";

export default function CardUI({ user, className = "" }) {
  const [flipped, setFlipped] = useState(false);

  if (!user) return null;

  const maskCard = (number) => {
    if (!number) return "**** **** **** ****";
    return "**** **** **** " + number.slice(-4);
  };

  return (
    <div className={className} style={{ perspective: "1000px" }}>
      <div
        className="relative w-full h-56 cursor-pointer transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={() => setFlipped(!flipped)}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl border border-white/20">
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-8 bg-yellow-400 rounded-lg"></div>
              <span className="text-sm font-semibold tracking-wider">CREDBIT</span>
            </div>

            <div className="mb-8">
              <p className="text-lg tracking-widest font-mono">
                {maskCard(user.cardNumber)}
              </p>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-80 uppercase tracking-wide">
                  Card Holder
                </p>
                <p className="text-lg font-semibold">{user.name}</p>
              </div>
              <div>
                <p className="text-xs opacity-80 uppercase tracking-wide">
                  Expires
                </p>
                <p className="text-lg font-semibold">
                  {user.exp || "12/28"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-2xl border border-white/20">
            <div className="w-full h-12 bg-slate-700 rounded-lg mb-8"></div>

            <div className="flex justify-end mb-4">
              <div className="bg-slate-600 px-4 py-2 rounded text-center">
                <p className="text-xs opacity-80">CVV</p>
                <p className="text-lg font-bold">{user.cvv || "***"}</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs opacity-80">
                This card is secured by CredBit
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}