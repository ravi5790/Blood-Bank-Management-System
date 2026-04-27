import React, { useEffect, useState } from "react";
import { api, BLOOD_GROUPS } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { Heart, MapPin, Phone, Activity } from "lucide-react";

export default function DonorDashboard() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({
    name: user.name || "",
    phone: user.phone || "",
    blood_group: user.blood_group || "",
    city: user.city || "",
    address: user.address || "",
    available: user.available ?? true,
  });
  const [requests, setRequests] = useState([]);

  async function loadRequests() {
    const { data } = await api.get("/requests/received");
    setRequests(data);
  }
  useEffect(() => { loadRequests(); }, []);

  async function save() {
    try {
      const { data } = await api.put("/profile", profile);
      setUser(data);
      toast.success("Profile updated");
    } catch (e) {
      toast.error("Failed to save");
    }
  }

  async function toggleAvailable(v) {
    setProfile({ ...profile, available: v });
    try {
      const { data } = await api.put("/profile", { available: v });
      setUser(data);
      toast.success(v ? "You're available" : "Marked unavailable");
    } catch { toast.error("Failed"); }
  }

  async function respond(id, status) {
    await api.post(`/requests/${id}/respond`, { status });
    toast.success(`Request ${status}`);
    loadRequests();
  }

  return (
    <div className="paper-bg min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Header role="Donor" name={user.name} />

        <div className="bg-white border border-[var(--line)] rounded-2xl p-6 mb-8 flex flex-wrap items-center justify-between gap-4" data-testid="availability-card">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${profile.available ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
              <Heart className="w-5 h-5" fill={profile.available ? "#16a34a" : "none"} />
            </div>
            <div>
              <div className="font-display font-bold text-xl">{profile.available ? "Available to donate" : "Unavailable"}</div>
              <div className="text-sm text-neutral-500">Toggle to update visibility in search</div>
            </div>
          </div>
          <Switch checked={profile.available} onCheckedChange={toggleAvailable} data-testid="availability-toggle" />
        </div>

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
            <TabsTrigger value="requests" data-testid="tab-requests">Requests · {requests.length}</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="bg-white border border-[var(--line)] rounded-2xl p-7 grid md:grid-cols-2 gap-5">
              <Field label="Name"><Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} data-testid="profile-name" /></Field>
              <Field label="Phone"><Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} data-testid="profile-phone" /></Field>
              <Field label="Blood group">
                <Select value={profile.blood_group} onValueChange={(v) => setProfile({ ...profile, blood_group: v })}>
                  <SelectTrigger data-testid="profile-blood"><SelectValue placeholder="Pick" /></SelectTrigger>
                  <SelectContent>{BLOOD_GROUPS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="City"><Input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} data-testid="profile-city" /></Field>
              <Field label="Address" full><Input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} data-testid="profile-address" /></Field>
              <div className="md:col-span-2">
                <Button onClick={save} className="bg-[var(--crimson)] hover:bg-[var(--crimson-dark)] rounded-full px-7" data-testid="profile-save">Save changes</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="mt-6 space-y-3">
            {requests.length === 0 ? (
              <div className="text-neutral-500 py-12 text-center border border-dashed border-[var(--line)] rounded-2xl">
                No requests yet. Stay available — someone may need your help soon.
              </div>
            ) : requests.map((r) => (
              <div key={r.id} className="bg-white border border-[var(--line)] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4" data-testid={`req-row-${r.id}`}>
                <div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-[var(--crimson)] text-white hover:bg-[var(--crimson)]">{r.blood_group}</Badge>
                    <span className="font-semibold">{r.requester_name}</span>
                    <span className="text-xs text-neutral-500">· {r.units} unit{r.units > 1 ? "s" : ""}</span>
                  </div>
                  {r.notes && <p className="text-sm text-neutral-600 mt-2">{r.notes}</p>}
                </div>
                {r.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => respond(r.id, "rejected")} data-testid={`reject-${r.id}`}>Reject</Button>
                    <Button size="sm" onClick={() => respond(r.id, "approved")} className="bg-[var(--crimson)] hover:bg-[var(--crimson-dark)]" data-testid={`approve-${r.id}`}>Approve</Button>
                  </div>
                ) : (
                  <Badge variant={r.status === "approved" ? "default" : "outline"}>{r.status}</Badge>
                )}
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export const Header = ({ role, name }) => (
  <div className="mb-10">
    <span className="font-mono-thin text-xs uppercase tracking-widest text-neutral-500">{role} dashboard</span>
    <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mt-2">
      Hi, {name?.split(" ")[0]}.
    </h1>
  </div>
);

const Field = ({ label, children, full }) => (
  <div className={`space-y-1.5 ${full ? "md:col-span-2" : ""}`}>
    <Label>{label}</Label>
    {children}
  </div>
);
