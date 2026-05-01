"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Trophy, Clock, HeadphonesIcon, Lock } from "lucide-react";

const features = [
  { icon: Zap, title: "Instant Match", desc: "Get matched with a top-tier booster within minutes of placing your order.", color: "#00FF87" },
  { icon: Shield, title: "100% Account Safe", desc: "VPN protection, offline mode, and encrypted credentials. Your account is in safe hands.", color: "#00D4FF" },
  { icon: Trophy, title: "Top 1% Boosters", desc: "Only the best Mythical Glory and Immortal players make it to our roster.", color: "#7B2FFF" },
  { icon: Clock, title: "Fast Delivery", desc: "Most orders completed within 24-72 hours. Track progress in real-time.", color: "#00FF87" },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Chat with our team anytime. We're always here to help with your boost.", color: "#00D4FF" },
  { icon: Lock, title: "Money-Back Guarantee", desc: "Not satisfied? We offer a full refund if we can't deliver what we promised.", color: "#7B2FFF" },
];

export function FeatureCards() {
  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-neonGreen text-[11px] font-orbitron tracking-[0.3em] uppercase mb-3">Why Choose Us</p>
          <h2 className="font-orbitron text-3xl sm:text-4xl font-black uppercase tracking-wide text-white">
            Built for Gamers
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="rounded-xl p-6 bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] transition-all group"
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                style={{ background: `${f.color}10`, border: `1px solid ${f.color}20` }}
              >
                <f.icon className="w-5 h-5" style={{ color: f.color }} />
              </div>
              <h3 className="font-orbitron text-sm font-bold mb-2 uppercase tracking-wider text-white">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
