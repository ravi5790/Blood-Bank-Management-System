import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { BLOOD_GROUPS } from "../lib/api";
import { Droplet } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const { register: doRegister } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const presetRole = params.get("role") || "donor";

  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "",
    role: presetRole, blood_group: "", city: "", address: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target ? e.target.value : e });

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const u = await doRegister({
        ...form,
        blood_group: form.blood_group || null,
      });
      toast.success(`Welcome, ${u.name}!`);
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
            Join 8,200+ <span className="italic text-[var(--crimson)]">heroes</span>.
          </h1>
          <p className="mt-5 text-neutral-600 max-w-md leading-relaxed">
            One signup. Lifetime impact. Choose your role and start helping today.
          </p>
        </div>
        <span className="font-mono-thin text-xs uppercase tracking-widest text-neutral-500">
          02 / new account
        </span>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <form onSubmit={submit} className="w-full max-w-md space-y-5" data-testid="register-form">
          <h2 className="font-display font-bold text-3xl">Create your account</h2>
          <p className="text-sm text-neutral-600 -mt-3">Already a member? <Link to="/login" className="text-[var(--crimson)] font-medium">Sign in</Link></p>

          <div className="grid grid-cols-2 gap-3">
            {["donor", "receiver", "hospital"].map((r) => (
              <button type="button" key={r}
                className={`chip justify-center py-2 capitalize ${form.role === r ? "chip-active" : ""}`}
                onClick={() => setForm({ ...form, role: r })}
                data-testid={`role-${r}`}>
                {r}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label>{form.role === "hospital" ? "Hospital name" : "Full name"}</Label>
            <Input value={form.name} onChange={set("name")} required data-testid="input-name" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={set("email")} required data-testid="input-email" />
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input type="password" value={form.password} onChange={set("password")} required data-testid="input-password" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={set("phone")} data-testid="input-phone" />
            </div>
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input value={form.city} onChange={set("city")} required data-testid="input-city" />
            </div>
          </div>

          {form.role === "donor" && (
            <div className="space-y-1.5">
              <Label>Blood group</Label>
              <Select value={form.blood_group} onValueChange={(v) => setForm({ ...form, blood_group: v })}>
                <SelectTrigger data-testid="input-blood-group"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Address (optional)</Label>
            <Input value={form.address} onChange={set("address")} data-testid="input-address" />
          </div>

          {err && <div className="text-sm text-[var(--crimson)]" data-testid="register-error">{err}</div>}

          <Button type="submit" disabled={busy} className="w-full h-11 bg-[var(--crimson)] hover:bg-[var(--crimson-dark)] rounded-full" data-testid="register-submit">
            {busy ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
