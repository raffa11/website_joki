"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Trophy, Clock, HeadphonesIcon, Lock } from "lucide-react";

const features = [
  { icon: Zap, title: "Instant Match", desc: "Get matched with a top-tier booster within minutes of placing your order.", color: "#00FF87" },
  { icon: Shield, title: "100% Account Safe", desc: "VPN protection, offline mode, and encrypted credentials. Your account is in safe hands.", color: "#00D4FF" },
  { icon: Trophy, title: "Top 1% Boosters", desc: "Only the best Mythical Glory and Immortal players make it to our roster.", color: "#7B2FFF" },
  { icon: Clock, title: "Fast Delivery", desc: "Most orders completed within 24-72 hours. Track progress in real-time.", color: "#00FF87" },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Chat with our team anytime. We're always here to help with your boost.", color: "#00D4FF" },
  { icon: Lock, title: "Money-Back Guarantee", desc: "Not satisfied? We offer a full refund if we can't deliver what we promised.", color: "#7B2FFF" },
];

const steps = [
  { num: "01", title: "Choose Your Rank", desc: "Select where you are now and where you want to be. Get an instant price.", color: "#00FF87" },
  { num: "02", title: "We Match a Booster", desc: "A verified top-tier player is assigned instantly. No waiting around.", color: "#00D4FF" },
  { num: "03", title: "Watch It Climb", desc: "Track your rank progress live from your dashboard. Sit back and relax.", color: "#7B2FFF" },
];

const characterImages = [
  "/Assets/Character/character1.png",
  "/Assets/Character/character2.png",
  "/Assets/Character/character3.png",
  "/Assets/Character/character4.png",
];

export function CombinedSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Unified Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-neonGreen text-[11px] font-orbitron tracking-[0.3em] uppercase mb-3">Why Choose Us</p>
          <h2 className="font-orbitron text-3xl sm:text-4xl font-black uppercase tracking-wide text-white mb-6">
            Built for Gamers
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-[#00FF87] to-[#00D4FF] mx-auto mb-6" />
          <p className="text-neonCyan text-[11px] font-orbitron tracking-[0.3em] uppercase mb-3">Simple Process</p>
          <h2 className="font-orbitron text-3xl sm:text-4xl font-black uppercase tracking-wide text-white">
            How It Works
          </h2>
        </motion.div>

        {/* How It Works Steps with Character Images */}
        <div className="grid md:grid-cols-3 gap-8 relative mb-16">
          {/* Connecting gradient line */}
          <div className="hidden md:block absolute top-14 left-[16%] right-[16%] h-px bg-gradient-to-r from-[#00FF87]/20 via-[#00D4FF]/20 to-[#7B2FFF]/20" />

          {steps.map((s, i) => (
            <motion.div
              key={`step-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-40px" }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="text-center relative"
            >
              {/* Character image replacing numbered circle */}
              <motion.div
                className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-5 relative z-10 overflow-hidden"
                style={{ background: `${s.color}08`, border: `1.5px solid ${s.color}30` }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={characterImages[i]}
                  alt={`Step ${s.num} Character`}
                  className="w-full h-full object-contain p-2"
                  style={{ filter: `drop-shadow(0 0 8px ${s.color}40)` }}
                />
              </motion.div>
              <h3 className="font-orbitron text-sm font-bold mb-2 uppercase tracking-wider text-white">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Feature Cards Grid with Character Decorations */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 relative">
          {/* 4th character as decorative element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 0.1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1 }}
            className="absolute -right-16 top-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none hidden lg:block"
          >
            <img
              src={characterImages[3]}
              alt="Decorative Character"
              className="w-full h-full object-contain"
            />
          </motion.div>

          {features.map((f, i) => (
            <motion.div
              key={`feature-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="rounded-xl p-6 bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] transition-all group relative overflow-hidden"
              whileHover={{ y: -4 }}
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                style={{ background: `${f.color}10`, border: `1px solid ${f.color}20` }}
              >
                <f.icon className="w-5 h-5" style={{ color: f.color }} />
              </div>
              <h3 className="font-orbitron text-sm font-bold mb-2 uppercase tracking-wider text-white">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${f.color}08 0%, transparent 70%)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background floating characters with parallax */}
      {characterImages.slice(0, 3).map((src, i) => (
        <motion.div
          key={`bg-char-${i}`}
          className="absolute pointer-events-none opacity-5"
          style={{
            top: `${15 + i * 25}%`,
            left: i % 2 === 0 ? '5%' : '85%',
            width: '200px',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 0.05, scale: 1 }}
          viewport={{ once: false }}
          transition={{ delay: i * 0.3, duration: 1.5 }}
        >
          <img src={src} alt="" className="w-full h-auto object-contain" />
        </motion.div>
      ))}
    </section>
  );
}
