"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Trophy, Clock, HeadphonesIcon, Lock } from "lucide-react";

/**
 * Combined Bento Grid Component
 * Replaces both "Why Choose Us" and "How It Works" with an elegant, character-driven bento layout.
 */
export function CombinedFeatures() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-neonGreen/[0.03] blur-[200px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-neonCyan text-[11px] font-orbitron tracking-[0.3em] uppercase mb-3">
            The Ultimate Experience
          </p>
          <h2 className="font-orbitron text-4xl sm:text-5xl font-black uppercase tracking-wide text-white">
            Built for Gamers
          </h2>
        </div>

        {/* 
          Bento Grid Layout: 4 columns, 4 rows on large screens. 
          Auto-rows of roughly 220px height to maintain proportion.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[240px] gap-4">

          {/* Block 1: 2x2 Feature + Character 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            className="lg:col-span-2 lg:row-span-2 rounded-3xl p-8 bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] hover:border-white/[0.15] transition-all group relative overflow-hidden flex flex-col justify-between"
          >
            <div className="relative z-10 max-w-[60%]">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-[#7B2FFF]/10 border border-[#7B2FFF]/20">
                <Trophy className="w-6 h-6 text-[#7B2FFF]" />
              </div>
              <h3 className="font-orbitron text-3xl font-black mb-3 uppercase tracking-wider text-white">Top 1% Boosters</h3>
              <p className="text-gray-400 text-base leading-relaxed">
                Only the best Mythical Glory and Immortal players make it to our roster. Your account is handled by proven professionals.
              </p>
            </div>
            {/* Character 1 */}
            <motion.img
              src="/assets/character/character1.png"
              alt="Character 1"
              className="absolute bottom-0 right-[-5%] w-[75%] lg:w-[85%] object-contain drop-shadow-[0_0_30px_rgba(123,47,255,0.3)] group-hover:scale-105 transition-transform duration-700"
              style={{ maxHeight: '125%', transformOrigin: 'bottom right' }}
            />
          </motion.div>

          {/* Block 2: 1x1 Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl p-6 bg-white/[0.02] border border-white/[0.08] hover:border-[#00FF87]/30 transition-all group relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 bg-[#00FF87]/10 border border-[#00FF87]/30">
              <span className="font-orbitron text-xs font-black text-[#00FF87]">01</span>
            </div>
            <h3 className="font-orbitron text-base font-bold mb-2 uppercase tracking-wider text-white group-hover:text-[#00FF87] transition-colors">Choose Your Rank</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Select where you are now and where you want to be. Get an instant price.
            </p>
          </motion.div>

          {/* Block 4: 1x2 Feature + Character 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 lg:row-span-2 rounded-3xl p-6 bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] hover:border-[#00D4FF]/30 transition-all group relative overflow-hidden flex flex-col"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-[#00D4FF]/10 border border-[#00D4FF]/20">
                <Shield className="w-6 h-6 text-[#00D4FF]" />
              </div>
              <h3 className="font-orbitron text-xl font-black mb-2 uppercase tracking-wider text-white">100% Account Safe</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                VPN protection, offline mode, and encrypted credentials.
              </p>
            </div>
            {/* Character 2 */}
            <motion.img
              src="/assets/character/character2.png"
              alt="Character 2"
              className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-[150%] object-contain drop-shadow-[0_0_20px_rgba(0,212,255,0.2)] group-hover:-translate-y-4 transition-transform duration-500"
              style={{ maxHeight: '95%', transformOrigin: 'bottom center' }}
            />
          </motion.div>

          {/* Block 3: 1x1 Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.15 }}
            className="rounded-3xl p-6 bg-white/[0.02] border border-white/[0.08] hover:border-[#00D4FF]/30 transition-all group relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 bg-[#00D4FF]/10 border border-[#00D4FF]/30">
              <span className="font-orbitron text-xs font-black text-[#00D4FF]">02</span>
            </div>
            <h3 className="font-orbitron text-base font-bold mb-2 uppercase tracking-wider text-white group-hover:text-[#00D4FF] transition-colors">Match a Booster</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              A verified top-tier player is assigned instantly. No waiting around.
            </p>
          </motion.div>

          {/* Block 6: 1x2 Feature + Character 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 lg:row-span-2 rounded-3xl p-6 bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] hover:border-[#00FF87]/30 transition-all group relative overflow-hidden flex flex-col"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-[#00FF87]/10 border border-[#00FF87]/20">
                <Zap className="w-6 h-6 text-[#00FF87]" />
              </div>
              <h3 className="font-orbitron text-xl font-black mb-2 uppercase tracking-wider text-white">Instant Match</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Get matched with a top-tier booster within minutes.
              </p>
            </div>
             {/* Character 3 */}
             <motion.img
              src="/assets/character/character3.png"
              alt="Character 3"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[55%] w-auto max-w-none object-contain drop-shadow-[0_0_20px_rgba(0,255,135,0.2)] group-hover:scale-105 transition-transform duration-700"
              style={{ transformOrigin: 'bottom center' }}
            />
          </motion.div>

          {/* Block 5: 2x1 Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.35 }}
            className="lg:col-span-2 lg:row-span-1 rounded-3xl p-8 bg-white/[0.02] border border-white/[0.08] hover:border-[#7B2FFF]/30 transition-all group relative overflow-hidden flex items-center gap-6"
          >
            <div className="w-16 h-16 shrink-0 rounded-full flex items-center justify-center bg-[#7B2FFF]/10 border border-[#7B2FFF]/30">
              <span className="font-orbitron text-xl font-black text-[#7B2FFF]">03</span>
            </div>
            <div>
              <h3 className="font-orbitron text-2xl font-bold mb-2 uppercase tracking-wider text-white group-hover:text-[#7B2FFF] transition-colors">Watch It Climb</h3>
              <p className="text-gray-500 text-base leading-relaxed max-w-md">
                Track your rank progress live from your dashboard. Sit back and relax while our pros do the heavy lifting.
              </p>
            </div>
          </motion.div>

          {/* Block 7: 1x1 Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl p-6 bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] transition-all group"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-[#00D4FF]/10 border border-[#00D4FF]/20">
              <HeadphonesIcon className="w-5 h-5 text-[#00D4FF]" />
            </div>
            <h3 className="font-orbitron text-base font-bold mb-2 uppercase tracking-wider text-white">24/7 Support</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Chat with our team anytime. We're always here to help.
            </p>
          </motion.div>

          {/* Block 9: 2x1 Feature + Character 4 */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-40px" }}
             transition={{ delay: 0.5 }}
             className="lg:col-span-2 lg:row-span-1 rounded-3xl p-8 bg-gradient-to-r from-white/[0.04] to-white/[0.01] border border-white/[0.08] hover:border-[#7B2FFF]/30 transition-all group relative overflow-hidden flex items-center"
          >
            <div className="relative z-10 max-w-[60%]">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-[#7B2FFF]/10 border border-[#7B2FFF]/20">
                <Lock className="w-5 h-5 text-[#7B2FFF]" />
              </div>
              <h3 className="font-orbitron text-xl font-bold mb-2 uppercase tracking-wider text-white">Money-Back Guarantee</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Not satisfied? We offer a full refund if we can't deliver what we promised.
              </p>
            </div>
             {/* Character 4 */}
             <motion.img
              src="/assets/character/character4.png"
              alt="Character 4"
              className="absolute bottom-0 right-[-10%] w-[65%] object-contain drop-shadow-[0_0_20px_rgba(123,47,255,0.2)] group-hover:scale-105 group-hover:-translate-x-4 transition-all duration-500"
              style={{ maxHeight: '140%' }}
            />
          </motion.div>

          {/* Block 8: 1x1 Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.6 }}
            className="rounded-3xl p-6 bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] transition-all group"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-[#00FF87]/10 border border-[#00FF87]/20">
              <Clock className="w-5 h-5 text-[#00FF87]" />
            </div>
            <h3 className="font-orbitron text-base font-bold mb-2 uppercase tracking-wider text-white">Fast Delivery</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Most orders completed within 24-72 hours.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
