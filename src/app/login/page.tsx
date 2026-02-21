"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ uname: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      console.log("Submitting login form:", form);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      console.log("Login response:", data, "Status:", res.status);
      
      if (res.ok) {
        console.log("Login successful, redirecting to dashboard");
        router.push("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Blob - Top Right */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full opacity-30 blur-3xl"></div>
      
      {/* Decorative Blob - Bottom Left */}
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-blue-500 to-purple-400 rounded-full opacity-20 blur-3xl"></div>

      <div className="relative z-10 max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-400 to-cyan-400 px-8 py-12 text-center relative">
          <div className="absolute inset-0 opacity-10 bg-pattern"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-4 shadow-md">
              <span className="text-blue-600 font-bold text-lg">K</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Welcome back!</h1>
            <p className="text-blue-100 text-sm">User Login</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-8 py-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email/Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email or Username</label>
              <input 
                name="uname" 
                placeholder="Enter your username" 
                value={form.uname} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition bg-gray-50 placeholder-gray-400"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                name="password" 
                type="password" 
                placeholder="Enter your password" 
                value={form.password} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition bg-gray-50 placeholder-gray-400 text-black"
              />
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 mt-8 shadow-md"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 flex items-center justify-between text-sm">
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Forgot Password?</a>
            <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">Register</a>
          </div>
        </div>
      </div>
    </div>
  );
}
