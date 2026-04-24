import React from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

const services = [
  { name: "Website", uptime: "100%", latency: "42ms" },
  { name: "AI Assistant", uptime: "100%", latency: "180ms" },
  { name: "Database", uptime: "100%", latency: "8ms" },
  { name: "API", uptime: "100%", latency: "55ms" },
];

const incidents = [
  { date: "Apr 18, 2026", title: "Scheduled maintenance — Database optimization", duration: "22 min", resolved: true },
  { date: "Apr 5, 2026", title: "Elevated API latency — CDN routing update", duration: "8 min", resolved: true },
];

export default function Status() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-border px-6 h-16 flex items-center">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2 ml-4">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">BasisPro</span>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Overall status */}
        <div className="bg-white rounded-2xl border border-border p-8 mb-8 text-center shadow-sm">
          <div className="inline-flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-full px-5 py-2.5 mb-5">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-700 font-semibold text-base">All Systems Operational</span>
          </div>
          <p className="text-muted-foreground text-sm">Last checked: {new Date().toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}</p>
        </div>

        {/* Service rows */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-base font-bold text-foreground">System Components</h2>
          </div>
          <div className="divide-y divide-border">
            {services.map((s) => (
              <div key={s.name} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="font-medium text-foreground text-sm">{s.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Uptime (30d)</div>
                    <div className="text-sm font-bold text-green-600">{s.uptime}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Latency</div>
                    <div className="text-sm font-semibold text-foreground">{s.latency}</div>
                  </div>
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">Operational</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Uptime bars — 90 days */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">90-Day Uptime History</h2>
            <span className="text-xs text-muted-foreground">Each bar = 1 day</span>
          </div>
          <div className="px-6 py-5 space-y-5">
            {services.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{s.name}</span>
                  <span className="text-sm font-bold text-green-600">{s.uptime} uptime</span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 90 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-7 rounded-sm"
                      style={{ background: i === 71 && s.name === "Database" ? "#FCD34D" : "#22C55E" }}
                      title={`Day ${90 - i}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-1 text-[11px] text-muted-foreground">
                  <span>90 days ago</span>
                  <span>Today</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past incidents */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-base font-bold text-foreground">Past Incidents</h2>
          </div>
          <div className="divide-y divide-border">
            {incidents.map((inc, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-yellow-400" />
                      <span className="text-sm font-semibold text-foreground">{inc.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{inc.date} · Duration: {inc.duration}</div>
                  </div>
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full flex-shrink-0">Resolved</span>
                </div>
              </div>
            ))}
            <div className="px-6 py-4 text-sm text-muted-foreground text-center">No other incidents in the last 90 days.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
