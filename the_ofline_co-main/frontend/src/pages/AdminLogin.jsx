import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export default function AdminLogin() {
  const { login, admin } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (admin) nav("/admin", { replace: true });
  }, [admin, nav]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) {
      toast.success("Welcome back.");
      nav("/admin", { replace: true });
    } else {
      toast.error(res.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-20" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <Link to="/" className="overline inline-flex items-center gap-2 mb-10 hover:text-paper">
          <ArrowLeft size={14} /> The Ofline Co.
        </Link>
        <p className="overline mb-3">Studio</p>
        <h1 className="font-serif text-5xl leading-[1.05] kerned">Sign in.</h1>
        <p className="mt-3 text-paper/55">Editorial control for cohorts, experiences, and the countdown.</p>

        <form onSubmit={onSubmit} className="mt-12 space-y-8">
          <div>
            <label className="editorial-label">Email</label>
            <input
              type="email"
              required
              data-testid="admin-email-input"
              className="editorial-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@theofflineco.com"
              autoFocus
            />
          </div>
          <div>
            <label className="editorial-label">Password</label>
            <input
              type="password"
              required
              data-testid="admin-password-input"
              className="editorial-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="ember-button w-full justify-center disabled:opacity-50"
            data-testid="admin-login-submit"
          >
            {loading ? "Opening…" : "Sign in"} <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
