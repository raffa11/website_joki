"use client";

import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CombinedFeatures } from "@/components/CombinedFeatures";
import { PricingCalculator } from "@/components/PricingCalculator";
import { BoosterCards } from "@/components/BoosterCards";
import { Testimonials } from "@/components/Testimonials";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Link from "next/link";

/* ── Reusable scroll-in wrapper ─────────────────────────────── */

/**
 * Props for the FadeIn wrapper component.
 */
interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * A reusable wrapper component that applies a scroll-triggered fade-in animation.
 * AI Note: Useful for wrapping any new sections to maintain consistent scroll-in effects.
 */
function FadeIn({ children, className = "", delay = 0 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Main Landing Page Component (Home).
 * Assembles the entire landing page by importing modular sections.
 * AI Note: To add a new section, import it and wrap it in `<FadeIn>` for scroll animations.
 * Don't forget to add a separator `div` if needed.
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-void text-white relative overflow-hidden">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────── */}
      <HeroSection />

      {/* ── Marquee trust strip ────────────────────────── */}
      <section className="py-5 border-y border-white/5 bg-void relative z-10 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex items-center gap-16 mr-16">
              {[
                "10.000+ PESANAN",
                "⚡ BOOSTER MITOSIS GLORY",
                "🛡️ 100% KEAMANAN AKUN",
                "🏆 99.9% WIN RATE",
                "⭐ 4.9/5 RATING",
                "🔥 PENGIRIMAN TERCEPAT",
                "💎 GARANSI UANG KEMBALI",
              ].map((t, i) => (
                <span key={`${rep}-${i}`} className="text-[11px] font-orbitron tracking-[0.15em] uppercase text-gray-600">
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Combined: Features + How It Works ────────── */}
      <FadeIn>
        <CombinedFeatures />
      </FadeIn>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent max-w-6xl mx-auto w-full" />

      {/* ── Pricing calculator ────────────────────────── */}
      <section id="ranks" className="py-24 relative">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neonGreen/[0.03] blur-[200px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <FadeIn className="text-center mb-14">
            <p className="text-neonGreen text-[11px] font-orbitron tracking-[0.3em] uppercase mb-3">Harga</p>
            <h2 className="font-orbitron text-3xl sm:text-4xl font-black uppercase tracking-wide text-white">
              Hitung Boost Anda
            </h2>
            <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
              Pilih rank awal dan target rank untuk mendapatkan estimasi harga instan.
            </p>
          </FadeIn>

          <div className="max-w-4xl mx-auto">
            {/* Calculator */}
            <FadeIn delay={0.1}>
              <PricingCalculator />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────── */}
      <FadeIn>
        <Testimonials />
      </FadeIn>

      {/* ── CTA Banner ────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neonGreen/[0.02] to-transparent" />
        <FadeIn className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-orbitron text-3xl sm:text-4xl font-black uppercase tracking-wide mb-5 text-white">
            Siap Naik Rank?
          </h2>
          <p className="text-gray-500 text-base mb-8 max-w-lg mx-auto">
            Bergabunglah dengan ribuan pemain yang mempercayakan perjalanan rank mereka kepada kami.
          </p>
          <a href="#ranks">
            <button className="btn-solid-neon px-12 py-4 rounded-xl text-sm cursor-pointer">
              MULAI SEKARANG
            </button>
          </a>
        </FadeIn>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-14 bg-void relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-neonGreen" />
              <span className="font-orbitron text-base font-black tracking-widest">
                BOOST<span className="text-neonGreen">TRACK</span>
              </span>
            </div>
            <div className="flex gap-8 text-xs text-gray-500 font-medium">
              <a href="#hero" className="hover:text-white transition-colors">Beranda</a>
              <a href="#ranks" className="hover:text-white transition-colors">Harga</a>
              <a href="#boosters" className="hover:text-white transition-colors">Booster</a>
              <a href="#features" className="hover:text-white transition-colors">Cara Kerja</a>
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-600 text-[11px] font-orbitron tracking-wider">
              © {new Date().getFullYear()} BOOSTTRACK. SEMUA HAK CIPTA DILINDUNGI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
