import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Droplet } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const u = await login(email, password);
      toast.success(`Welcome back, ${u.name}!`);
      nav(`/dashboard/${u.role}`);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2 paper-bg">
      <div className="hidden lg:flex flex-col justify-between p-14 bone-bg border-r border-[var(--line)]">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--crimson)] flex items-center justify-center text-white">
            <Droplet className="w-4 h-4" fill="white" />
          </div>
          <span className="font-display font-bold text-xl">BloodLink</span>
        </Link>
        <div>
          <h1 className="font-display font-bold text-5xl tracking-tight leading-tight">
            Welcome <span className="italic text-[var(--crimson)]">back</span>.
          </h1>
          <p className="mt-5 text-neutral-600 max-w-md leading-relaxed">
            Sign in to manage donations, requests and inventory.
          </p>
        </div>
        <span className="font-mono-thin text-xs uppercase tracking-widest text-neutral-500">
          01 / sign in
        </span>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5" data-testid="login-form">
          <h2 className="font-display font-bold text-3xl">Sign in</h2>
          <p className="text-sm text-neutral-600 -mt-3">
            New here? <Link to="/register" className="text-[var(--crimson)] font-medium">Create account</Link>
          </p>

          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid="login-email" />
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required data-testid="login-password" />
          </div>

          {err && <div className="text-sm text-[var(--crimson)]" data-testid="login-error">{err}</div>}

          <Button type="submit" disabled={busy} className="w-full h-11 bg-[var(--crimson)] hover:bg-[var(--crimson-dark)] rounded-full" data-testid="login-submit">
            {busy ? "Signing in…" : "Sign in"}
          </Button>

          <div className="text-xs text-neutral-500 pt-4 divider-dotted">
            <span className="font-mono-thin">demo:</span> admin@bloodbank.com / admin123
          </div>
        </form>
      </div>
    </div>
  );
}
