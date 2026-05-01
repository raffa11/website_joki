"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Trophy, Clock, HeadphonesIcon, Lock } from "lucide-react";

/**
 * Combined Bento Grid Component
 * Replaces both "Why Choose Us" and "How It Works" with an elegant, character-driven bento layout.
 * Mobile: Consistent sizing for all elements
 * Desktop: Varied sizes for visual hierarchy
 */
export function CombinedFeatures() {
  return (
    <section id="features" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neonGreen/[0.03] blur-[200px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-neonCyan text-[11px] font-orbitron tracking-[0.3em] uppercase mb-3">
            The Ultimate Experience
          </p>
          <h2 className="font-orbitron text-2xl sm:text-4xl font-black uppercase tracking-wide text-white">
            Built for Gamers
          </h2>
        </div>

        {/* 
          Mobile: Single column, consistent card sizes
          Tablet: 2 columns
          Desktop: 4 columns with bento layout, varied sizes
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Block 1: Top 1% Boosters - Full width on mobile, 2 cols on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            className="md:col-span-2 rounded-2xl sm:rounded-3xl p-5 sm:p-8 bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] hover:border-white/[0.15] transition-all group relative overflow-hidden"
          >
            <div className="relative z-10 max-w-full sm:max-w-[60%]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-6 bg-[#7B2FFF]/10 border border-[#7B2FFF]/20">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-[#7B2FFF]" />
              </div>
              <h3 className="font-orbitron text-base sm:text-3xl font-black mb-2 sm:mb-3 uppercase tracking-wider text-white">Top 1% Boosters</h3>
              <p className="text-gray-400 text-xs sm:text-base leading-relaxed">
                Only the best Mythical Glory and Immortal players make it to our roster. Your account is handled by proven professionals.
              </p>
            </div>
            {/* Character 1 - Hidden on mobile, shown on larger screens */}
            <motion.img
              src="/assets/character/character1.png"
              alt="Character 1"
              className="hidden sm:block absolute bottom-0 right-[-5%] w-[60%] sm:w-[75%] lg:w-[85%] object-contain drop-shadow-[0_0_30px_rgba(123,47,255,0.3)] group-hover:scale-105 transition-transform duration-700"
              style={{ maxHeight: '125%', transformOrigin: 'bottom right' }}
            />
          </motion.div>

          {/* Block 2: Choose Your Rank - Step 01 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-white/[0.02] border border-white/[0.08] hover:border-[#00FF87]/30 transition-all group"
          >
            <div className="w-10 h-10 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-3 sm:mb-4 bg-[#00FF87]/10 border border-[#00FF87]/30">
              <span className="font-orbitron text-[10px] sm:text-xs font-black text-[#00FF87]">01</span>
            </div>
            <h3 className="font-orbitron text-base sm:text-base font-bold mb-2 uppercase tracking-wider text-white group-hover:text-[#00FF87] transition-colors">Choose Your Rank</h3>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              Select where you are now and where you want to be. Get an instant price.
            </p>
          </motion.div>

          {/* Block 3: 100% Account Safe with Character 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 lg:col-span-1 rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] hover:border-[#00D4FF]/30 transition-all group relative overflow-hidden flex flex-col"
          >
            <div className="relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-6 bg-[#00D4FF]/10 border border-[#00D4FF]/20">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#00D4FF]" />
              </div>
              <h3 className="font-orbitron text-base sm:text-xl font-black mb-2 uppercase tracking-wider text-white">100% Account Safe</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                VPN protection, offline mode, and encrypted credentials.
              </p>
            </div>
            {/* Character 2 - Hidden on mobile */}
            <motion.img
              src="/assets/character/character2.png"
              alt="Character 2"
              className="hidden sm:block absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-[120%] sm:w-[150%] object-contain drop-shadow-[0_0_20px_rgba(0,212,255,0.2)] group-hover:-translate-y-4 transition-transform duration-500"
              style={{ maxHeight: '95%', transformOrigin: 'bottom center' }}
            />
          </motion.div>

          {/* Block 4: Match a Booster - Step 02 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-white/[0.02] border border-white/[0.08] hover:border-[#00D4FF]/30 transition-all group"
          >
            <div className="w-10 h-10 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-3 sm:mb-4 bg-[#00D4FF]/10 border border-[#00D4FF]/30">
              <span className="font-orbitron text-[10px] sm:text-xs font-black text-[#00D4FF]">02</span>
            </div>
            <h3 className="font-orbitron text-base sm:text-base font-bold mb-2 uppercase tracking-wider text-white group-hover:text-[#00D4FF] transition-colors">Match a Booster</h3>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              A verified top-tier player is assigned instantly. No waiting around.
            </p>
          </motion.div>

          {/* Block 5: Instant Match */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] hover:border-[#00FF87]/30 transition-all group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-6 bg-[#00FF87]/10 border border-[#00FF87]/20">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#00FF87]" />
            </div>
            <h3 className="font-orbitron text-base sm:text-xl font-black mb-2 uppercase tracking-wider text-white">Instant Match</h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Get matched with a top-tier booster within minutes.
            </p>
          </motion.div>

          {/* Block 6: Watch It Climb - Step 03 - Full width on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.35 }}
            className="md:col-span-2 rounded-2xl sm:rounded-3xl p-5 sm:p-8 bg-white/[0.02] border border-white/[0.08] hover:border-[#7B2FFF]/30 transition-all group flex flex-col sm:flex-row items-start gap-4 sm:gap-6"
          >
            <div className="w-10 h-10 sm:w-16 sm:h-16 shrink-0 rounded-full flex items-center justify-center bg-[#7B2FFF]/10 border border-[#7B2FFF]/30">
              <span className="font-orbitron text-base sm:text-xl font-black text-[#7B2FFF]">03</span>
            </div>
            <div>
              <h3 className="font-orbitron text-base sm:text-2xl font-bold mb-2 uppercase tracking-wider text-white group-hover:text-[#7B2FFF] transition-colors">Watch It Climb</h3>
              <p className="text-gray-500 text-xs sm:text-base leading-relaxed">
                Track your rank progress live from your dashboard. Sit back and relax while our pros do the heavy lifting.
              </p>
            </div>
          </motion.div>

          {/* Block 7: 24/7 Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] transition-all group"
          >
            <div className="w-10 h-10 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 bg-[#00D4FF]/10 border border-[#00D4FF]/20">
              <HeadphonesIcon className="w-5 h-5 sm:w-5 sm:h-5 text-[#00D4FF]" />
            </div>
            <h3 className="font-orbitron text-base sm:text-base font-bold mb-2 uppercase tracking-wider text-white">24/7 Support</h3>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              Chat with our team anytime. We're always here to help.
            </p>
          </motion.div>

          {/* Block 8: Money-Back Guarantee with Character 4 */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-40px" }}
             transition={{ delay: 0.5 }}
             className="md:col-span-2 rounded-2xl sm:rounded-3xl p-5 sm:p-8 bg-gradient-to-r from-white/[0.04] to-white/[0.01] border border-white/[0.08] hover:border-[#7B2FFF]/30 transition-all group relative overflow-hidden flex flex-col sm:flex-row items-start gap-4 sm:gap-6"
          >
            <div className="relative z-10 max-w-full sm:max-w-[60%]">
              <div className="w-10 h-10 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 bg-[#7B2FFF]/10 border border-[#7B2FFF]/20">
                <Lock className="w-5 h-5 sm:w-5 sm:h-5 text-[#7B2FFF]" />
              </div>
              <h3 className="font-orbitron text-base sm:text-xl font-bold mb-2 uppercase tracking-wider text-white">Money-Back Guarantee</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Not satisfied? We offer a full refund if we can't deliver what we promised.
              </p>
            </div>
             {/* Character 4 - Hidden on mobile */}
             <motion.img
              src="/assets/character/character4.png"
              alt="Character 4"
              className="hidden sm:block absolute bottom-0 right-[-10%] w-[50%] sm:w-[65%] object-contain drop-shadow-[0_0_20px_rgba(123,47,255,0.2)] group-hover:scale-105 group-hover:-translate-x-4 transition-all duration-500"
              style={{ maxHeight: '140%' }}
            />
          </motion.div>

          {/* Block 9: Fast Delivery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] transition-all group"
          >
            <div className="w-10 h-10 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 bg-[#00FF87]/10 border border-[#00FF87]/20">
              <Clock className="w-5 h-5 sm:w-5 sm:h-5 text-[#00FF87]" />
            </div>
            <h3 className="font-orbitron text-base sm:text-base font-bold mb-2 uppercase tracking-wider text-white">Fast Delivery</h3>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              Most orders completed within 24-72 hours.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
