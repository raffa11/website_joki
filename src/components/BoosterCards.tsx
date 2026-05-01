"use client";

import { motion } from "framer-motion";
import { Star, Shield, Zap, User } from "lucide-react";

const boosters = [
  { name: "PhantomX", rank: "Mythical Immortal", wr: "98.2%", speed: "Fast", games: "4.2K", img: "/assets/ranks/Mythical Immortal.png" },
  { name: "ShadowBlade", rank: "Mythical Glory", wr: "97.5%", speed: "Fast", games: "3.8K", img: "/assets/ranks/Mythical Glory.png" },
  { name: "DragonKing", rank: "Mythical Glory", wr: "96.8%", speed: "Normal", games: "5.1K", img: "/assets/ranks/Mythical Glory.png" },
  { name: "NightHawk", rank: "Mythical Honor", wr: "95.9%", speed: "Fast", games: "2.9K", img: "/assets/ranks/Mythical Honor.png" },
];

export function BoosterCards() {
  return (
    <section id="boosters" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <p className="text-neonPurple text-[11px] font-orbitron tracking-[0.3em] uppercase mb-3">Elite Players</p>
          <h2 className="font-orbitron text-3xl sm:text-4xl font-black uppercase tracking-wide text-white">
            Featured Boosters
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {boosters.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-xl p-5 bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] flex flex-col items-center gap-3 group transition-all cursor-pointer hover:-translate-y-1"
            >
              <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-full bg-void border border-white/10 group-hover:border-neonGreen/30 flex items-center justify-center overflow-hidden transition-all">
                  <User className="w-8 h-8 text-gray-700 group-hover:text-neonGreen/60 transition-colors" />
                </div>
                <img src={b.img} alt={b.rank} className="absolute -bottom-1 -right-1 w-7 h-7 object-contain" />
              </div>
              <div className="text-center">
                <h4 className="font-orbitron font-bold text-xs uppercase text-white">{b.name}</h4>
                <p className="text-[10px] text-neonGreen mt-0.5">{b.rank}</p>
              </div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <div className="flex gap-4 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-green-400" />{b.wr}</span>
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-neonCyan" />{b.speed}</span>
              </div>
              <p className="text-[9px] text-gray-600 uppercase tracking-widest">{b.games} games</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
