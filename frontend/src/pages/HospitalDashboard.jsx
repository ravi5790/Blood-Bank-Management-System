import React, { useEffect, useState } from "react";
import { api, BLOOD_GROUPS } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Header } from "./DonorDashboard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { Droplet } from "lucide-react";

export default function HospitalDashboard() {
  const { user } = useAuth();
  const [inv, setInv] = useState(BLOOD_GROUPS.map((bg) => ({ blood_group: bg, units: 0 })));
  const [requests, setRequests] = useState([]);

  async function load() {
    const [i, r] = await Promise.all([
      api.get("/inventory/me"),
      api.get("/requests/received"),
    ]);
    const fromServer = i.data || [];
    const map = Object.fromEntries(fromServer.map((it) => [it.blood_group, it.units]));
    setInv(BLOOD_GROUPS.map((bg) => ({ blood_group: bg, units: map[bg] ?? 0 })));
    setRequests(r.data);
  }
  useEffect(() => { load(); }, []);

  async function saveInv() {
    await api.put("/inventory/me", { items: inv });
    toast.success("Inventory updated");
  }

  async function respond(id, status) {
    await api.post(`/requests/${id}/respond`, { status });
    toast.success(`Request ${status}`);
    load();
  }

  return (
    <div className="paper-bg min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Header role="Hospital" name={user.name} />

        <Tabs defaultValue="inventory">
          <TabsList>
            <TabsTrigger value="inventory" data-testid="tab-inventory">Blood inventory</TabsTrigger>
            <TabsTrigger value="requests" data-testid="tab-requests">Requests · {requests.length}</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="mt-6">
            <div className="bg-white border border-[var(--line)] rounded-2xl p-7">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {inv.map((it, idx) => (
                  <div key={it.blood_group} className="border border-[var(--line)] rounded-xl p-4 hover:border-[var(--crimson)] transition" data-testid={`inv-${it.blood_group}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Droplet className="w-4 h-4 fill-[var(--crimson)] text-[var(--crimson)]" />
                      <span className="font-display font-bold text-lg">{it.blood_group}</span>
                    </div>
                    <Input type="number" min={0} value={it.units} onChange={(e) => {
                      const next = [...inv]; next[idx].units = Number(e.target.value || 0); setInv(next);
                    }} />
                    <div className="text-xs text-neutral-500 mt-1">units available</div>
                  </div>
                ))}
              </div>
              <Button onClick={saveInv} className="mt-6 bg-[var(--crimson)] hover:bg-[var(--crimson-dark)] rounded-full px-7" data-testid="inv-save">
                Save inventory
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="mt-6 space-y-3">
            {requests.length === 0 ? (
              <div className="text-neutral-500 py-12 text-center border border-dashed border-[var(--line)] rounded-2xl">
                No requests received yet.
              </div>
            ) : requests.map((r) => (
              <div key={r.id} className="bg-white border border-[var(--line)] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3" data-testid={`hreq-${r.id}`}>
                <div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-[var(--crimson)] text-white hover:bg-[var(--crimson)]">{r.blood_group}</Badge>
                    <span className="font-semibold">{r.requester_name}</span>
                    <span className="text-xs text-neutral-500">· {r.units} unit{r.units > 1 ? "s" : ""} · {r.city}</span>
                  </div>
                  {r.notes && <p className="text-sm text-neutral-600 mt-2">{r.notes}</p>}
                </div>
                {r.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => respond(r.id, "rejected")} data-testid={`hreject-${r.id}`}>Reject</Button>
                    <Button size="sm" onClick={() => respond(r.id, "approved")} className="bg-[var(--crimson)] hover:bg-[var(--crimson-dark)]" data-testid={`happrove-${r.id}`}>Approve</Button>
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
