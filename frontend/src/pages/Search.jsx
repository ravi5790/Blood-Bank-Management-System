import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api, BLOOD_GROUPS } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { Search as SearchIcon, MapPin, Phone, Droplet, Hospital as HospIcon, Send } from "lucide-react";

export default function SearchPage() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [bg, setBg] = useState(params.get("blood_group") || "");
  const [city, setCity] = useState(params.get("city") || "");
  const [tab, setTab] = useState(params.get("tab") || "hospitals");
  const [donors, setDonors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(null); // {type, item}
  const [units, setUnits] = useState(1);
  const [notes, setNotes] = useState("");

  async function load() {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (bg && bg !== "any") q.set("blood_group", bg);
      if (city) q.set("city", city);
      const [h, d] = await Promise.all([
        api.get(`/hospitals?${q.toString()}`),
        api.get(`/donors?${q.toString()}`),
      ]);
      setHospitals(h.data); setDonors(d.data);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  function search(e) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (bg) q.set("blood_group", bg);
    if (city) q.set("city", city);
    q.set("tab", tab);
    setParams(q);
    load();
  }

  async function sendRequest() {
    if (!user) { toast.error("Please sign in to send a request"); return; }
    if (!target) return;
    try {
      await api.post("/requests", {
        blood_group: bg || target.item.blood_group || "O+",
        units: Number(units),
        city: city || user.city,
        notes,
        target_type: target.type,
        target_id: target.item.id,
      });
      toast.success("Request sent!");
      setTarget(null); setNotes(""); setUnits(1);
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to send request");
    }
  }

  return (
    <div className="paper-bg min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <span className="font-mono-thin text-xs uppercase tracking-widest text-neutral-500">discover</span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mt-2">
            Find blood, fast.
          </h1>
        </div>

        <form onSubmit={search} className="grid md:grid-cols-[1fr_1fr_auto] gap-3 mb-10 p-5 bg-white border border-[var(--line)] rounded-2xl" data-testid="search-form">
          <div>
            <Label className="text-xs">Blood group</Label>
            <Select value={bg} onValueChange={setBg}>
              <SelectTrigger data-testid="search-blood-group"><SelectValue placeholder="Any" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {BLOOD_GROUPS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">City</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mumbai" data-testid="search-city" />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="h-10 px-7 bg-[var(--crimson)] hover:bg-[var(--crimson-dark)] rounded-full" data-testid="search-submit">
              <SearchIcon className="w-4 h-4 mr-1" /> Search
            </Button>
          </div>
        </form>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="hospitals" data-testid="tab-hospitals">Hospitals · {hospitals.length}</TabsTrigger>
            <TabsTrigger value="donors" data-testid="tab-donors">Donors · {donors.length}</TabsTrigger>
          </TabsList>

          <TabsContent value="hospitals" className="mt-6">
            {loading ? <Loading /> : hospitals.length === 0 ? <Empty label="No hospitals found." /> : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hospitals.map((h) => (
                  <div key={h.id} className="bg-white border border-[var(--line)] rounded-2xl p-5 hover:border-[var(--crimson)] transition-all" data-testid={`hospital-card-${h.id}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <HospIcon className="w-4 h-4 text-[var(--crimson)]" />
                          <h3 className="font-display font-bold text-lg">{h.name}</h3>
                        </div>
                        <p className="text-sm text-neutral-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{h.city}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {(h.inventory || []).filter(i => i.units > 0).map((i) => (
                        <span key={i.blood_group} className="chip text-xs">
                          <Droplet className="w-3 h-3 fill-[var(--crimson)] text-[var(--crimson)]" />
                          {i.blood_group} <b>·{i.units}</b>
                        </span>
                      ))}
                      {(!h.inventory || h.inventory.every(i => i.units === 0)) && (
                        <span className="text-xs text-neutral-500">No stock published</span>
                      )}
                    </div>
                    {h.phone && <p className="mt-3 text-xs text-neutral-600 flex items-center gap-1"><Phone className="w-3 h-3" />{h.phone}</p>}
                    <Button size="sm" onClick={() => setTarget({ type: "hospital", item: h })} className="mt-4 w-full bg-neutral-900 hover:bg-neutral-800 rounded-full" data-testid={`request-hospital-${h.id}`}>
                      <Send className="w-3.5 h-3.5 mr-1" /> Request
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="donors" className="mt-6">
            {loading ? <Loading /> : donors.length === 0 ? <Empty label="No donors found." /> : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {donors.map((d) => (
                  <div key={d.id} className="bg-white border border-[var(--line)] rounded-2xl p-5 hover:border-[var(--crimson)] transition-all" data-testid={`donor-card-${d.id}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-lg">{d.name}</h3>
                      <Badge className="bg-[var(--crimson)] text-white hover:bg-[var(--crimson)]">{d.blood_group}</Badge>
                    </div>
                    <p className="text-sm text-neutral-500 flex items-center gap-1 mt-2"><MapPin className="w-3 h-3" />{d.city}</p>
                    {d.phone && <p className="text-xs text-neutral-600 flex items-center gap-1 mt-1"><Phone className="w-3 h-3" />{d.phone}</p>}
                    <Button size="sm" onClick={() => setTarget({ type: "donor", item: d })} className="mt-4 w-full bg-neutral-900 hover:bg-neutral-800 rounded-full" data-testid={`request-donor-${d.id}`}>
                      <Send className="w-3.5 h-3.5 mr-1" /> Request
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent data-testid="request-dialog">
          <DialogHeader>
            <DialogTitle>Send blood request</DialogTitle>
          </DialogHeader>
          {target && (
            <div className="space-y-4">
              <div className="text-sm text-neutral-600">To <b>{target.item.name}</b> ({target.type})</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Blood group</Label>
                  <Select value={bg} onValueChange={setBg}>
                    <SelectTrigger><SelectValue placeholder="Pick" /></SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Units</Label>
                  <Input type="number" min={1} value={units} onChange={(e) => setUnits(e.target.value)} data-testid="request-units" />
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Patient details, urgency, etc." data-testid="request-notes" />
              </div>
              {!user && <p className="text-sm text-[var(--crimson)]">Please <Link to="/login" className="underline">sign in</Link> first.</p>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)}>Cancel</Button>
            <Button onClick={sendRequest} disabled={!user || !bg} className="bg-[var(--crimson)] hover:bg-[var(--crimson-dark)]" data-testid="request-send">
              Send request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const Loading = () => <div className="text-neutral-500 py-10 text-center">Loading…</div>;
const Empty = ({ label }) => <div className="text-neutral-500 py-12 text-center border border-dashed border-[var(--line)] rounded-2xl">{label}</div>;
