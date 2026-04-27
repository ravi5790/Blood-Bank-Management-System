import React from "react";
import { Link } from "react-router-dom";
import { Droplet, ArrowUpRight, MapPin, Activity, Hospital, Users, ShieldCheck, Search } from "lucide-react";
import { Button } from "../components/ui/button";

const STATS = [
  { label: "Lives saved monthly", value: "12,400+" },
  { label: "Active donors", value: "8.2k" },
  { label: "Partner hospitals", value: "320" },
];

const BLOOD = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Landing() {
  return (
    <div data-testid="landing-page">
      {/* HERO */}
      <section className="paper-bg pt-16 pb-20 border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7 slide-up">
            <div className="inline-flex items-center gap-2 mb-7">
              <span className="live-dot" />
              <span className="font-mono-thin text-xs uppercase tracking-widest text-neutral-600">
                Live blood network · 24 cities
              </span>
            </div>
            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
              A drop saves a life.<br />
              <span className="text-[var(--crimson)] italic">Be the drop.</span>
            </h1>
            <p className="mt-7 text-lg text-neutral-600 max-w-xl leading-relaxed">
              BloodLink connects donors, hospitals and people in urgent need — in seconds, not hours. Search by blood group and city, send a request, get a response.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/register">
                <Button className="h-12 px-7 bg-[var(--crimson)] hover:bg-[var(--crimson-dark)] text-white rounded-full text-base font-semibold" data-testid="cta-donate">
                  Become a donor
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/search">
                <Button variant="outline" className="h-12 px-7 rounded-full border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white text-base font-semibold" data-testid="cta-find">
                  <Search className="w-4 h-4 mr-2" />
                  Find blood now
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-2" data-testid="blood-chips">
              {BLOOD.map((b) => (
                <Link key={b} to={`/search?blood_group=${encodeURIComponent(b)}`} className="chip">
                  <Droplet className="w-3 h-3 fill-[var(--crimson)] text-[var(--crimson)]" />
                  {b}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bone-bg rounded-3xl p-8 border border-[var(--line)] relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[var(--crimson)] opacity-10" />
              <div className="font-mono-thin text-xs uppercase tracking-widest text-neutral-500">
                Network impact
              </div>
              <div className="mt-5 space-y-6">
                {STATS.map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between border-b border-dashed border-neutral-300 pb-4 last:border-0">
                    <span className="text-sm text-neutral-600">{s.label}</span>
                    <span className="font-display font-bold text-3xl">{s.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex items-center gap-2 text-xs text-neutral-500">
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-mono-thin">Updated · just now</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight max-w-xl">
              Three roles. One mission. Zero friction.
            </h2>
            <span className="font-mono-thin text-xs uppercase tracking-widest text-neutral-500">
              01 / how it works
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Donors", desc: "Register your blood group and city. Toggle availability anytime. Get matched with people nearby.", role: "donor" },
              { icon: Hospital, title: "Hospitals", desc: "Manage live inventory of all 8 blood groups. Approve or reject requests in one click.", role: "hospital" },
              { icon: Activity, title: "Receivers", desc: "Search by blood group + city. Send a request to a hospital or donor. Track responses.", role: "receiver" },
            ].map(({ icon: Icon, title, desc, role }) => (
              <Link key={title} to={`/register?role=${role}`} className="group rounded-2xl border border-[var(--line)] p-7 hover:border-[var(--crimson)] hover:-translate-y-1 transition-all bg-white">
                <Icon className="w-7 h-7 text-[var(--crimson)] mb-5" />
                <h3 className="font-display font-bold text-2xl mb-2">{title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{desc}</p>
                <div className="mt-5 flex items-center gap-1 text-sm font-medium text-neutral-900 group-hover:text-[var(--crimson)]">
                  Join as {title.toLowerCase()} <ArrowUpRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="bone-bg py-20 border-t border-[var(--line)]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <ShieldCheck className="w-10 h-10 text-[var(--crimson)] mx-auto mb-5" />
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight">
            Verified donors. Vetted hospitals.
          </h2>
          <p className="mt-5 text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Every account is reviewed. Inventory is updated by hospital staff in real time. Your data stays encrypted and private.
          </p>
          <Link to="/register">
            <Button className="mt-8 h-12 px-8 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full" data-testid="cta-bottom">
              Start saving lives — free forever
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-neutral-500 border-t border-[var(--line)]">
        <span className="font-mono-thin">© BloodLink · A non-profit demonstration project</span>
      </footer>
    </div>
  );
}
