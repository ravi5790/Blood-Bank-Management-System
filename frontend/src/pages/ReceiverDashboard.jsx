import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Header } from "./DonorDashboard";
import { Search } from "lucide-react";

export default function ReceiverDashboard() {
  const { user } = useAuth();
  const [sent, setSent] = useState([]);

  useEffect(() => { (async () => {
    const { data } = await api.get("/requests/sent");
    setSent(data);
  })(); }, []);

  return (
    <div className="paper-bg min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Header role="Receiver" name={user.name} />

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Stat label="Total requests" value={sent.length} />
          <Stat label="Pending" value={sent.filter(r => r.status === "pending").length} />
          <Stat label="Approved" value={sent.filter(r => r.status === "approved").length} />
        </div>

        <Link to="/search">
          <Button className="bg-[var(--crimson)] hover:bg-[var(--crimson-dark)] rounded-full px-7 mb-8" data-testid="goto-search">
            <Search className="w-4 h-4 mr-2" /> Find blood now
          </Button>
        </Link>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all" data-testid="tab-all">All requests</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6 space-y-3">
            {sent.length === 0 ? (
              <div className="text-neutral-500 py-12 text-center border border-dashed border-[var(--line)] rounded-2xl">
                No requests yet — start by searching for blood.
              </div>
            ) : sent.map((r) => (
              <div key={r.id} className="bg-white border border-[var(--line)] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3" data-testid={`sent-${r.id}`}>
                <div className="flex items-center gap-3">
                  <Badge className="bg-[var(--crimson)] text-white hover:bg-[var(--crimson)]">{r.blood_group}</Badge>
                  <span className="font-semibold capitalize">To {r.target_type}</span>
                  <span className="text-xs text-neutral-500">· {r.units} unit{r.units > 1 ? "s" : ""} · {r.city}</span>
                </div>
                <Badge variant={r.status === "approved" ? "default" : r.status === "rejected" ? "destructive" : "outline"}>
                  {r.status}
                </Badge>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="bg-white border border-[var(--line)] rounded-2xl p-5">
    <div className="font-mono-thin text-xs uppercase tracking-widest text-neutral-500">{label}</div>
    <div className="font-display font-bold text-4xl mt-2">{value}</div>
  </div>
);
