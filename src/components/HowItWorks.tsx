"use client";

import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Choose Your Rank", desc: "Select where you are now and where you want to be. Get an instant price.", color: "#00FF87" },
  { num: "02", title: "We Match a Booster", desc: "A verified top-tier player is assigned instantly. No waiting around.", color: "#00D4FF" },
  { num: "03", title: "Watch It Climb", desc: "Track your rank progress live from your dashboard. Sit back and relax.", color: "#7B2FFF" },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <p className="text-neonCyan text-[11px] font-orbitron tracking-[0.3em] uppercase mb-3">Simple Process</p>
          <h2 className="font-orbitron text-3xl sm:text-4xl font-black uppercase tracking-wide text-white">
            How It Works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-14 left-[16%] right-[16%] h-px bg-gradient-to-r from-[#00FF87]/20 via-[#00D4FF]/20 to-[#7B2FFF]/20" />

          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-40px" }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="text-center relative"
            >
              <div
                className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-5 relative z-10"
                style={{ background: `${s.color}08`, border: `1.5px solid ${s.color}30` }}
              >
                <span className="font-orbitron text-sm font-black" style={{ color: s.color }}>{s.num}</span>
              </div>
              <h3 className="font-orbitron text-sm font-bold mb-2 uppercase tracking-wider text-white">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
