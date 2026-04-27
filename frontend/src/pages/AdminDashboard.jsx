import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Header } from "./DonorDashboard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#c8102e", "#ea580c", "#0284c7", "#7c3aed", "#16a34a", "#ca8a04", "#be185d", "#0f766e"];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);

  async function load() {
    const [u, r, a] = await Promise.all([
      api.get("/admin/users"),
      api.get("/admin/requests"),
      api.get("/analytics/overview"),
    ]);
    setUsers(u.data); setRequests(r.data); setStats(a.data);
  }
  useEffect(() => { load(); }, []);

  async function del(id) {
    if (!confirm("Delete this user?")) return;
    await api.delete(`/admin/users/${id}`);
    toast.success("User deleted");
    load();
  }

  return (
    <div className="paper-bg min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Header role="Admin" name={user.name} />

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Stat label="Donors" value={stats.totals.donors} />
            <Stat label="Hospitals" value={stats.totals.hospitals} />
            <Stat label="Receivers" value={stats.totals.receivers} />
            <Stat label="Requests" value={stats.totals.requests} accent />
          </div>
        )}

        <Tabs defaultValue="charts">
          <TabsList>
            <TabsTrigger value="charts" data-testid="tab-charts">Analytics</TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">Users · {users.length}</TabsTrigger>
            <TabsTrigger value="requests" data-testid="tab-requests">Requests · {requests.length}</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="mt-6 grid lg:grid-cols-2 gap-5">
            {stats && (
              <>
                <ChartCard title="Blood group demand (units)">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={stats.demand}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="blood_group" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="units" fill="#c8102e" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Donor distribution">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={stats.donor_distribution.filter(d => d.count > 0)} dataKey="count" nameKey="blood_group" cx="50%" cy="50%" outerRadius={90} label>
                        {stats.donor_distribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip /><Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Hospital inventory (total units)">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={stats.inventory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="blood_group" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="units" fill="#0b0b0d" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Request status">
                  <div className="grid grid-cols-3 gap-4 h-[280px] items-center">
                    <Big label="pending" value={stats.totals.pending} />
                    <Big label="approved" value={stats.totals.approved} />
                    <Big label="total" value={stats.totals.requests} />
                  </div>
                </ChartCard>
              </>
            )}
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="bg-white border border-[var(--line)] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">City</th>
                    <th className="text-left p-4">Blood</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-[var(--line)]" data-testid={`user-row-${u.id}`}>
                      <td className="p-4 font-medium">{u.name}</td>
                      <td className="p-4 text-neutral-600">{u.email}</td>
                      <td className="p-4 capitalize"><Badge variant="outline">{u.role}</Badge></td>
                      <td className="p-4 text-neutral-600">{u.city || "—"}</td>
                      <td className="p-4">{u.blood_group || "—"}</td>
                      <td className="p-4 text-right">
                        {u.role !== "admin" && (
                          <Button size="sm" variant="ghost" onClick={() => del(u.id)} data-testid={`del-user-${u.id}`}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="mt-6 space-y-2">
            {requests.map((r) => (
              <div key={r.id} className="bg-white border border-[var(--line)] rounded-2xl p-4 flex flex-wrap justify-between gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <Badge className="bg-[var(--crimson)] text-white hover:bg-[var(--crimson)]">{r.blood_group}</Badge>
                  <span className="font-medium">{r.requester_name}</span>
                  <span className="text-neutral-500">→ {r.target_type}</span>
                  <span className="text-neutral-500">· {r.units}u</span>
                </div>
                <Badge variant={r.status === "approved" ? "default" : "outline"}>{r.status}</Badge>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const Stat = ({ label, value, accent }) => (
  <div className={`rounded-2xl p-5 border ${accent ? "bg-[var(--crimson)] border-[var(--crimson)] text-white" : "bg-white border-[var(--line)]"}`}>
    <div className={`font-mono-thin text-xs uppercase tracking-widest ${accent ? "text-white/80" : "text-neutral-500"}`}>{label}</div>
    <div className="font-display font-bold text-4xl mt-2">{value}</div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white border border-[var(--line)] rounded-2xl p-5">
    <div className="font-display font-bold text-lg mb-4">{title}</div>
    {children}
  </div>
);

const Big = ({ label, value }) => (
  <div className="text-center">
    <div className="font-mono-thin text-xs uppercase tracking-widest text-neutral-500">{label}</div>
    <div className="font-display font-bold text-5xl text-[var(--crimson)] mt-2">{value}</div>
  </div>
);
