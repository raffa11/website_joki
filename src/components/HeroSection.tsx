"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Shield, Zap, Trophy, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Utility function to animate individual words with a stagger effect.
 * Easily customizable by modifying the 'initial' and 'animate' properties.
 * @param text The word to animate.
 * @param delay The delay before the animation starts.
 */
const word = (text: string, delay: number) => (
  <motion.span
    key={text}
    initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
    className="inline-block mr-3"
  >
    {text}
  </motion.span>
);

/**
 * Main Hero Section component.
 * Features advanced mouse-tracking parallax effects using Framer Motion's useMotionValue, useSpring, and useTransform.
 * Designed to be highly modular so AI tools can easily adjust parallax depths and animations.
 */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // ── Parallax Configuration ──
  // AI Note: Adjust springConfig stiffness and damping to change mouse follow speed/smoothness.
  const springConfig = { stiffness: 50, damping: 30, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // AI Note: useTransform maps the smooth 0-1 mouse value to px/percentage offsets.
  // For stronger parallax, increase the range (e.g., [15, -15] to [30, -30]).
  
  // Parallax transforms for the background image
  const bgX = useTransform(smoothX, [0, 1], [15, -15]);
  const bgY = useTransform(smoothY, [0, 1], [10, -10]);
  const bgScale = useTransform(smoothY, [0, 1], [1.08, 1.12]);

  // Parallax for floating rank badges (stronger effect)
  const badge1X = useTransform(smoothX, [0, 1], [30, -30]);
  const badge1Y = useTransform(smoothY, [0, 1], [20, -20]);
  const badge2X = useTransform(smoothX, [0, 1], [-25, 25]);
  const badge2Y = useTransform(smoothY, [0, 1], [-15, 15]);

  // Glow position follows mouse
  const glowX = useTransform(smoothX, [0, 1], ["20%", "80%"]);
  const glowY = useTransform(smoothY, [0, 1], ["20%", "80%"]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
    };
    const section = sectionRef.current;
    section?.addEventListener("mousemove", handleMouseMove);
    return () => section?.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* ── Hayabusa Background Image ── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ x: bgX, y: bgY, scale: bgScale }}
      >
        <motion.img
          src="/assets/Hayabusa.jpg"
          alt=""
          className="absolute right-0 top-0 w-full h-full object-cover object-center"
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1.1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{
            maskImage: "linear-gradient(to left, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0) 65%)",
            WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0) 65%)",
          }}
        />
      </motion.div>

      {/* ── Animated gradient overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/90 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/50 z-[1]" />

      {/* ── Interactive glow that follows mouse ── */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none z-[1]"
        style={{
          left: glowX,
          top: glowY,
          x: "-50%",
          y: "-50%",
          background: "radial-gradient(circle, rgba(0,255,135,0.06) 0%, rgba(0,212,255,0.03) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Subtle radial backgrounds */}
      <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-neonGreen/[0.06] blur-[200px] rounded-full pointer-events-none z-[1]" />
      <div className="absolute bottom-[0%] right-[5%] w-[400px] h-[400px] bg-neonCyan/[0.04] blur-[180px] rounded-full pointer-events-none z-[1]" />

      {/* Floating rank badges — interactive parallax */}
      <motion.img
        src="/assets/ranks/Epic.png"
        alt="Epic"
        className="absolute top-28 right-[12%] w-16 h-16 opacity-20 pointer-events-none hidden lg:block z-[2]"
        style={{ x: badge1X, y: badge1Y }}
        animate={{ rotate: [0, 5, -3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src="/assets/ranks/Legend.png"
        alt="Legend"
        className="absolute bottom-32 left-[8%] w-14 h-14 opacity-15 pointer-events-none hidden lg:block z-[2]"
        style={{ x: badge2X, y: badge2Y }}
        animate={{ rotate: [0, -4, 6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Particle lines / scanline effect ── */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,135,0.5) 2px, rgba(0,255,135,0.5) 3px)",
          backgroundSize: "100% 4px",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
        {/* Text content — full width now */}
        <div className="space-y-7 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neonGreen/20 bg-neonGreen/[0.04] text-neonGreen text-[11px] font-orbitron tracking-widest uppercase backdrop-blur-sm"
          >
            <Zap className="w-3 h-3" /> #1 Mobile Legends Boosting
          </motion.div>

          <h1 className="font-orbitron text-4xl lg:text-6xl font-black uppercase leading-[1.1] tracking-wide">
            {word("CLIMB", 0.3)}
            {word("THE", 0.45)}
            <br className="hidden sm:block" />
            <span className="text-neonGreen">
              {word("RANKS.", 0.6)}
            </span>
            <br />
            {word("DOMINATE", 0.8)}
            <br className="hidden sm:block" />
            {word("THE", 0.95)}
            {" "}
            <span className="text-neonCyan">
              {word("BATTLEFIELD.", 1.1)}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="text-gray-400 text-base max-w-lg leading-relaxed"
          >
            Professional boosters, real-time tracking, and transparent pricing.
            Get to your dream rank fast — guaranteed.
          </motion.p>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.6 }}
            className="flex gap-8 pt-2"
          >
            {[
              { icon: Shield, val: "10K+", label: "Orders Done", color: "text-neonGreen" },
              { icon: Trophy, val: "99.9%", label: "Win Rate", color: "text-neonCyan" },
              { icon: Zap, val: "< 1hr", label: "Start Time", color: "text-white" },
            ].map((s, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <div>
                  <p className={`font-orbitron font-black text-base ${s.color}`}>{s.val}</p>
                  <p className="text-[9px] text-gray-600 uppercase tracking-widest">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="flex gap-4 pt-2"
          >
            <a href="#ranks">
              <motion.button
                className="btn-solid-neon px-10 py-4 rounded-xl text-sm cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                START BOOSTING
              </motion.button>
            </a>
            <a href="#how-it-works">
              <motion.button
                className="btn-neon px-8 py-4 rounded-xl text-sm cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                HOW IT WORKS
              </motion.button>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[10px] text-gray-600 tracking-[0.3em] uppercase font-orbitron">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown className="w-5 h-5 text-neonGreen/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
