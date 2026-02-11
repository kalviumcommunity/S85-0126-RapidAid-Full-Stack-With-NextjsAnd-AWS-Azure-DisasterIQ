"use client";

import React from "react";

type Stat = { label: string; value: string; color?: string };

const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => (
  <div className="bg-surface-dark rounded-lg p-4 flex-1 min-w-[160px]">
    <div className="text-sm text-muted mb-2">{stat.label}</div>
    <div className="text-2xl font-semibold">{stat.value}</div>
  </div>
);

const DisasterCard: React.FC<{
  title: string;
  typeLabel?: string;
  severity?: string;
  desc?: string;
}> = ({ title, typeLabel, severity, desc }) => (
  <div className="bg-surface-dark rounded-lg p-6 w-full">
    <div className="flex justify-between items-start mb-3">
      <div>
        <div className="text-xs text-accent uppercase mb-1">{typeLabel}</div>
        <div className="text-lg font-semibold">{title}</div>
      </div>
      <div className="text-sm">
        <span className="inline-block bg-yellow-600 text-white text-xs px-2 py-1 rounded">
          {severity}
        </span>
      </div>
    </div>
    <div className="text-sm text-muted">{desc}</div>
    <div className="mt-4 text-xs text-muted flex gap-4">
      <div>📍 Mumbai Suburbs</div>
      <div>👥 450 affected</div>
      <div>🕒 14/05/2024</div>
    </div>
  </div>
);

export default function CitizenHomePage() {
  const stats: Stat[] = [
    { label: "Active Alerts", value: "04", color: "red" },
    { label: "Volunteers Active", value: "1,245" },
    { label: "Relief Centers", value: "28" },
    { label: "Relief Funds (INR)", value: "₹4.2Cr" },
  ];

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Citizen Dashboard</h1>
            <p className="text-sm text-muted">Public Safety Portal</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-[#1f2937] px-4 py-2 rounded text-sm">Emergency Kit</button>
            <button className="bg-red-600 px-4 py-2 rounded text-sm">DECLARE EMERGENCY</button>
            <div className="text-right">
              <div className="font-semibold">John Doe</div>
              <div className="text-xs text-muted">CITIZEN (MUMBAI)</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              JD
            </div>
          </div>
        </header>

        {/* Region banner */}
        <section className="mb-6">
          <div className="bg-[#091023] rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-muted">Monitoring: Mumbai Metropolitan Region</div>
              <div className="text-xs text-muted">Safe Zone Status: 85% • Population Protected: 12.4M</div>
            </div>
            <div className="text-sm text-muted">Status: <span className="text-green-400 font-semibold">Monitoring</span></div>
          </div>
        </section>

        {/* Stats row */}
        <section className="mb-8">
          <div className="flex gap-4">
            {stats.map((s) => (
              <StatCard key={s.label} stat={s} />
            ))}
          </div>
        </section>

        {/* Active & Monitored Disasters */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Active & Monitored Disasters</h2>
            <div className="text-sm text-muted">Regional incidents currently under surveillance</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DisasterCard
              title="Flash Flood North"
              typeLabel="- FLOOD"
              severity="Moderate"
              desc="Sudden heavy rainfall causing waterlogging in low-lying areas. Monitoring ongoing."
            />
            <DisasterCard
              title="Coastal Storm Surge"
              typeLabel="- STORM"
              severity="High"
              desc="High waves and strong winds reported. Evacuation protocols in place for coastline zones."
            />
          </div>
        </section>
      </div>
    </div>
  );
}
