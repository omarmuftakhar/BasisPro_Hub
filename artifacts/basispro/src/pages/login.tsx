import React, { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/lib/auth";

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const ok = login(email, password);
      if (ok) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div
      className="min-h-screen font-sans flex items-center justify-center px-4"
      style={{ background: "#F0F4FF" }}
    >
      <div className="w-full max-w-md">
        {/* Back to home */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
        >
          ← Back to home
        </button>

        <div
          className="bg-white rounded-2xl shadow-lg border border-border"
          style={{ padding: "40px" }}
        >
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 justify-center w-full mb-8"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
        >
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-base">B</span>
          </div>
          <span className="font-bold text-2xl text-foreground tracking-tight">BasisPro</span>
        </button>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1.5">Welcome back</h1>
          <p className="text-muted-foreground text-sm">Sign in to your BasisPro account</p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-lg text-sm mb-5"
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#DC2626",
              padding: "12px 16px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Email address
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full border border-border rounded-lg px-4 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Forgot password */}
        <div className="text-center mt-4">
          <button
            type="button"
            className="text-sm text-primary hover:underline"
            onClick={() => {}}
          >
            Forgot password?
          </button>
        </div>

        {/* Signup link */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a
            href="/#pricing"
            className="font-semibold text-primary hover:underline"
            onClick={(e) => { e.preventDefault(); navigate("/"); setTimeout(() => { const el = document.getElementById("pricing"); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 100); }}
          >
            Subscribe Now
          </a>
        </div>
        </div>
      </div>
    </div>
  );
}
