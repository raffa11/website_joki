"use client";

import { motion } from "framer-motion";
import { Star, User } from "lucide-react";

const testimonials = [
  { name: "Alex P.", rank: "Mythical Glory", text: "Fastest boost I've ever experienced. The real-time tracking dashboard is insane — I could see every game result live!" },
  { name: "Sarah K.", rank: "Legend", text: "Super safe and professional. My booster was polite, communicated well, and finished 2 days ahead of schedule." },
  { name: "Mike T.", rank: "Epic → Legend", text: "The UI is amazing. I knew exactly what was happening with my account at all times. Worth every rupiah." },
  { name: "Rina D.", rank: "Grandmaster → Mythic", text: "I was skeptical at first, but the results speak for themselves. My account is safe and my rank is exactly where I wanted." },
];

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neonGreen/[0.03] blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-neonGreen text-[11px] font-orbitron tracking-[0.4em] uppercase mb-3">Feedback</p>
          <h2 className="font-orbitron text-4xl sm:text-5xl font-black uppercase tracking-wide text-white">
            Trusted by Thousands
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative"
            >
              <div className="h-full rounded-2xl p-7 bg-gradient-to-br from-neonGreen/10 via-neonGreen/[0.02] to-transparent border border-neonGreen/20 hover:border-neonGreen/40 transition-all duration-500 backdrop-blur-sm flex flex-col">
                {/* Quote Icon */}
                <div className="text-neonGreen/40 text-4xl font-serif leading-none mb-4 group-hover:text-neonGreen/60 transition-colors">&ldquo;</div>
                
                {/* Content */}
                <p className="text-white/80 text-sm leading-relaxed mb-8 italic flex-grow">
                  {t.text}
                </p>
                
                {/* User Info */}
                <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                  <div className="w-10 h-10 rounded-xl bg-neonGreen/10 border border-neonGreen/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,135,0.1)] group-hover:bg-neonGreen/20 transition-all duration-500">
                    <User className="w-5 h-5 text-neonGreen" />
                  </div>
                  <div>
                    <p className="text-white font-orbitron text-xs font-bold uppercase tracking-wider">{t.name}</p>
                    <p className="text-neonGreen/70 text-[10px] font-bold uppercase tracking-tight">{t.rank}</p>
                  </div>
                </div>
                
                {/* Stars */}
                <div className="flex gap-1 mt-4">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-3 h-3 text-neonGreen fill-neonGreen drop-shadow-[0_0_5px_rgba(0,255,135,0.5)]" />
                  ))}
                </div>

                {/* Decorative corner glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-neonGreen/[0.03] blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
