"use client";
import { useState } from "react";

export default function DashboardPage() {
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkBalance = async () => {
    setLoading(true);
    try {
      console.log("Checking balance...");
      const res = await fetch("/api/auth/balance");
      const data = await res.json();
      
      console.log("Balance response:", data, "Status:", res.status);
      
      if (res.ok) {
        setMessage(`₹ ${data.balance.toLocaleString()}`);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        setMessage(data.error || "Failed to fetch balance");
      }
    } catch (err) {
      console.error("Balance check error:", err);
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl shadow-2xl p-8 lg:p-12 text-white mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome to KodBanking</h1>
              <p className="text-blue-100 text-lg">Your financial dashboard</p>
            </div>
            <div className="hidden lg:block text-blue-300 text-5xl opacity-30">💳</div>
          </div>

          {/* Balance Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
            <p className="text-blue-100 text-sm font-medium mb-2">Your Current Balance</p>
            {message ? (
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-black">{message}</span>
              </div>
            ) : (
              <p className="text-3xl font-bold opacity-60">Click to check balance</p>
            )}
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                💰
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">Check Your Balance</h2>
            <p className="text-gray-500 text-center mb-8 max-w-sm">
              Knowledge is power. Check your account balance anytime, anywhere.
            </p>

            <button 
              onClick={checkBalance} 
              disabled={loading}
              className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-12 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 shadow-lg text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Checking...
                </span>
              ) : (
                "Check Balance"
              )}
            </button>
          </div>

          {/* Additional Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <a href="#" className="p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition text-center">
                <div className="text-2xl mb-2">📊</div>
                <p className="font-medium text-gray-800">View Transactions</p>
              </a>
              <a href="#" className="p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition text-center">
                <div className="text-2xl mb-2">⚙️</div>
                <p className="font-medium text-gray-800">Settings</p>
              </a>
              <a href="/login" className="p-4 rounded-xl border border-gray-200 hover:border-red-400 hover:bg-red-50 transition text-center">
                <div className="text-2xl mb-2">🚪</div>
                <p className="font-medium text-gray-800">Logout</p>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <style>{`
            @keyframes confetti-fall {
              0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
              }
              100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
              }
            }
            .confetti {
              position: absolute;
              width: 10px;
              height: 10px;
              background: #ff6b6b;
              animation: confetti-fall 3s ease-out forwards;
            }
          `}</style>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: Math.random() * 100 + "%",
                delay: Math.random() * 0.5 + "s",
                animationDelay: Math.random() * 0.5 + "s",
                backgroundColor: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#6c5ce7"][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
