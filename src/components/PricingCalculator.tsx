"use client";

import React, { useState, useMemo, useRef, memo } from "react";
import { supabase } from "@/lib/supabase";
import { Star, ArrowRight, Download } from "lucide-react";
import {
  RANK_CONFIG,
  getTierList,
  getRomanNumeral,
  getRankMaxStars,
  getRankMinStars,
  calculateRankOutput,
  RANK_ORDER,
} from "@/lib/rankConfig";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

/* ── Asset Constants ────────────────────────────────── */
const RANK_IMAGES: Record<string, string> = {
  warrior: "/assets/ranks/Warrior.png",
  elite: "/assets/ranks/Elite.png",
  master: "/assets/ranks/Master.png",
  grandmaster: "/assets/ranks/Grandmaster.png",
  epic: "/assets/ranks/Epic.png",
  legend: "/assets/ranks/Legend.png",
  mythic: "/assets/ranks/Mythic.png",
  mythical_honor: "/assets/ranks/Mythical Honor.png",
  mythical_glory: "/assets/ranks/Mythical Glory.png",
  mythical_immortal: "/assets/ranks/Mythical Immortal.png",
};

const RANK_BACKGROUNDS: Record<string, string> = {
  warrior: "/assets/BoxBackground/bg1.png",
  elite: "/assets/BoxBackground/bg2.png",
  master: "/assets/BoxBackground/bg3.png",
  grandmaster: "/assets/BoxBackground/bg4.png",
  epic: "/assets/BoxBackground/bg5.png",
  legend: "/assets/BoxBackground/bg6.png",
  mythic: "/assets/BoxBackground/bg7.png",
  mythical_honor: "/assets/BoxBackground/bg8.png",
  mythical_glory: "/assets/BoxBackground/bg9.png",
  mythical_immortal: "/assets/BoxBackground/bg10.png",
};

const RANK_KEYS = Object.keys(RANK_CONFIG);

/* ── Optimized Sub-Components ────────────────────────────────── */

const TierCarousel = memo(({ value, tiers, onChange }: any) => {
  if (!tiers || tiers.length === 0) return null;
  const activeIdx = tiers.indexOf(value);

  return (
    <div className="flex flex-col items-center">
      <p className="text-[9px] text-gray-500 uppercase tracking-widest font-orbitron mb-1">Tier</p>
      <div className="w-[100px] h-10 relative flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden mask-fade-sides">
        <motion.div className="flex items-center justify-center" drag="x" dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x > 20 && activeIdx > 0) onChange(tiers[activeIdx - 1]);
            else if (info.offset.x < -20 && activeIdx < tiers.length - 1) onChange(tiers[activeIdx + 1]);
          }}
        >
          {tiers.map((t: any, i: number) => {
            const isActive = i === activeIdx;
            if (Math.abs(i - activeIdx) > 2) return null;
            return (
              <motion.div key={t} className="absolute w-8 h-8 flex items-center justify-center font-orbitron font-bold cursor-pointer"
                animate={{ x: (i - activeIdx) * 30, scale: isActive ? 1.3 : 0.8, opacity: isActive ? 1 : 0.3, color: isActive ? '#00FF87' : '#9CA3AF' }}
                onClick={() => onChange(t)}
              >
                {getRomanNumeral(t)}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
});

const StarCarousel = memo(({ value, maxStars, onChange, label, rankId }: any) => {
  const minStars = rankId ? getRankMinStars(rankId) : 0;
  const windowRange = 10;
  const stars = useMemo(() => {
    const start = Math.max(minStars, value - windowRange);
    const end = Math.min(maxStars, value + windowRange);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [minStars, maxStars, value]);

  return (
    <div className="flex flex-col items-center">
      <p className="text-[9px] text-gray-500 uppercase tracking-widest font-orbitron mb-1">{label}</p>
      <div className="w-[120px] h-10 relative flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden mask-fade-sides">
        <motion.div className="flex items-center justify-center" drag="x" dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x > 15 && value > minStars) onChange(value - 1);
            else if (info.offset.x < -15 && value < maxStars) onChange(value + 1);
          }}
        >
          {stars.map((s) => {
            const diff = s - value;
            const isActive = diff === 0;
            if (Math.abs(diff) > 3) return null;
            return (
              <motion.div key={s} className="absolute w-8 h-8 flex items-center justify-center font-orbitron font-bold cursor-pointer"
                animate={{ x: diff * 35, scale: isActive ? 1.4 : 0.8, opacity: isActive ? 1 : 0.3, color: isActive ? '#FBBF24' : '#9CA3AF' }}
                onClick={() => onChange(s)}
              >
                {s}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
});

const RankCarousel = memo(({ rankId, onRankChange }: any) => {
  const activeIdx = RANK_KEYS.indexOf(rankId);
  const len = RANK_KEYS.length;
  const startX = useRef(0);

  const handleDrag = (diff: number) => {
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIdx > 0) onRankChange(RANK_KEYS[activeIdx - 1]);
      else if (diff < 0 && activeIdx < len - 1) onRankChange(RANK_KEYS[activeIdx + 1]);
    }
  };

  return (
    <div className="relative w-full max-w-[300px] h-[240px] flex items-center justify-center mt-14 mb-2 cursor-grab active:cursor-grabbing"
      onMouseDown={(e) => (startX.current = e.pageX)}
      onMouseUp={(e) => handleDrag(e.pageX - startX.current)}
      onTouchStart={(e) => (startX.current = e.touches[0].pageX)}
      onTouchEnd={(e) => handleDrag(startX.current - e.changedTouches[0].pageX)}
    >
      {RANK_KEYS.map((key, i) => {
        let diff = i - activeIdx;
        if (diff < -Math.floor(len/2)) diff += len;
        if (diff > Math.floor(len/2)) diff -= len;

        const isActive = diff === 0;
        const isHidden = !isActive && Math.abs(diff) > 1;

        return (
          <motion.div key={key} className="absolute" initial={false}
            animate={{ x: diff * 100, scale: isActive ? 1 : 0.75, zIndex: isActive ? 10 : 5, opacity: isActive ? 1 : (isHidden ? 0 : 0.4) }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={() => onRankChange(key)}
            style={{ pointerEvents: isHidden ? 'none' : 'auto' }}
          >
            <div className={`relative w-40 h-[190px] rounded-2xl border transition-all duration-300 flex flex-col items-center justify-end pb-5 ${isActive ? 'bg-white/10 border-white/20 shadow-glow' : 'bg-white/[0.02] border-white/5'}`}>
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <motion.img src={RANK_BACKGROUNDS[key]} className="w-full h-full object-cover" animate={{ opacity: isActive ? 0.35 : 0.15, scale: isActive ? 1.1 : 1 }} />
              </div>
              <motion.img src={RANK_IMAGES[key]} className="absolute object-contain drop-shadow-xl pointer-events-none" animate={{ top: isActive ? -55 : -20, width: isActive ? 150 : 100, height: isActive ? 150 : 100 }} draggable={false} />
              <p className={`font-orbitron font-bold tracking-wider text-center w-full ${isActive ? 'text-white' : 'text-gray-400 opacity-50'}`}>{RANK_CONFIG[key].name}</p>
              {isActive && (
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-orbitron font-bold text-white">4.9</span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});

/* ── Main Component ──────────────────────────────────────────── */

export function PricingCalculator() {
  const [state, setState] = useState({
    current: { id: "epic", tier: 5, star: 0 },
    target: { id: "legend", tier: 5, star: 0 },
    step: 0,
    loading: false,
    paymentMethod: "",
    formData: { gameId: "", serverId: "", whatsapp: "" }
  });

  const updateState = (key: string, value: any) => setState(prev => ({ ...prev, [key]: value }));
  const updateRank = (type: 'current' | 'target', data: any) => 
    setState(prev => ({ ...prev, [type]: { ...prev[type], ...data } }));
  
  const currentMaxStars = getRankMaxStars(state.current.id);
  const targetMaxStars = getRankMaxStars(state.target.id);

  const pricing = useMemo(() => 
    calculateRankOutput(state.current.id, state.current.tier, state.current.star, state.target.id, state.target.tier, state.target.star),
    [state.current, state.target]
  );

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.paymentMethod) return alert("Pilih metode pembayaran");
    
    try {
      updateState('loading', true);
      
      // Check if user is logged in before submitting
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (confirm("Anda harus login untuk memesan. Redirect ke halaman login?")) {
          window.location.href = "/login?redirect=#ranks";
        }
        return;
      }

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...state.formData,
          paymentMethod: state.paymentMethod,
          currentRank: `${RANK_CONFIG[state.current.id].name} ${getRomanNumeral(state.current.tier)} (${state.current.star}★)`,
          targetRank: `${RANK_CONFIG[state.target.id].name} ${getRomanNumeral(state.target.tier)} (${state.target.star}★)`,
          price: pricing.total_price,
          starsTotal: pricing.stars_needed,
          userName: session.user?.email?.split('@')[0] || 'User',
        }),
      });
      const data = await res.json();
      if (data.success) window.location.href = `/track?code=${data.order.order_code}&success=true`;
      else alert(data.error || "Pengiriman pesanan gagal");
    } catch (error) {
      alert("Pengiriman gagal. Silakan coba lagi.");
    } finally {
      updateState('loading', false);
    }
  };

  const fmtIDR = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="w-full" id="pricing-section">
      <div className="rounded-3xl bg-white/[0.02] border border-white/[0.08] p-6 sm:p-10 shadow-2xl backdrop-blur-sm overflow-hidden">
        <AnimatePresence mode="wait">
          {state.step === 0 ? (
            <motion.div key="calc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-4">
                <div className="flex flex-col items-center flex-1 w-full">
                  <span className="text-[13px] font-orbitron font-bold tracking-widest uppercase text-white mb-2">Rank Saat Ini</span>
                  <div className="flex items-center gap-6 h-14 mt-2">
                    <TierCarousel value={state.current.tier} tiers={getTierList(state.current.id)} onChange={(tier: number) => updateRank('current', { tier })} />
                    <StarCarousel value={state.current.star} maxStars={currentMaxStars} onChange={(star: number) => updateRank('current', { star })} label="Bintang" rankId={state.current.id} />
                  </div>
                  <RankCarousel rankId={state.current.id} onRankChange={(id: string) => updateRank('current', { id, tier: getTierList(id)[0], star: getRankMinStars(id) })} />
                </div>

                <div className="flex items-center justify-center lg:pt-40"><ArrowRight className="w-6 h-6 text-neonGreen lg:rotate-0 rotate-90" /></div>

                <div className="flex flex-col items-center flex-1 w-full">
                  <span className="text-[13px] font-orbitron font-bold tracking-widest uppercase text-white mb-2">Rank Target</span>
                  <div className="flex items-center gap-6 h-14 mt-2">
                    <TierCarousel value={state.target.tier} tiers={getTierList(state.target.id)} onChange={(tier: number) => updateRank('target', { tier })} />
                    <StarCarousel value={state.target.star} maxStars={targetMaxStars} onChange={(star: number) => updateRank('target', { star })} label="Bintang" rankId={state.target.id} />
                  </div>
                  <RankCarousel rankId={state.target.id} onRankChange={(id: string) => updateRank('target', { id, tier: getTierList(id)[0], star: getRankMinStars(id) })} />
                </div>
              </div>

              <div className="mt-12 flex flex-col items-center border-t border-white/5 pt-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-20 mb-8 w-full max-w-md">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-orbitron mb-1">Bintang Diperlukan</p>
                    <p className="text-2xl sm:text-4xl font-black text-white font-orbitron">{pricing.stars_needed}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-orbitron mb-1">Total Harga</p>
                    <p className="text-lg sm:text-2xl md:text-4xl font-black text-neonGreen font-orbitron glow-green">{fmtIDR(pricing.total_price)}</p>
                  </div>
                </div>
                <button 
                  className="btn-solid-neon w-full max-w-md h-14 rounded-xl uppercase tracking-widest text-sm disabled:opacity-50" 
                  disabled={pricing.total_price <= 0} 
                  onClick={async () => {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session) {
                      if (confirm("Anda harus login untuk memesan. Redirect ke halaman login?")) {
                        window.location.href = "/login?redirect=#ranks";
                      }
                      return;
                    }
                    updateState('step', 1);
                  }}
                >
                  Langkah Berikutnya →
                </button>
              </div>
            </motion.div>
          ) : state.step === 1 ? (
            <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="max-w-lg mx-auto space-y-8">
                {/* Step indicator */}
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-neonGreen/20 border border-neonGreen/40 flex items-center justify-center text-neonGreen text-[10px] font-orbitron font-bold">1</div>
                    <span className="text-[10px] text-gray-500 font-orbitron tracking-widest uppercase hidden sm:inline">Rank</span>
                  </div>
                  <div className="w-8 h-px bg-neonGreen/30"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-neonGreen border border-neonGreen flex items-center justify-center text-dark text-[10px] font-orbitron font-bold">2</div>
                    <span className="text-[10px] text-neonGreen font-orbitron tracking-widest uppercase hidden sm:inline">Detail</span>
                  </div>
                  <div className="w-8 h-px bg-white/10"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 text-[10px] font-orbitron font-bold">3</div>
                    <span className="text-[10px] text-gray-500 font-orbitron tracking-widest uppercase hidden sm:inline">Bayar</span>
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-bold font-orbitron uppercase tracking-wide">Detail <span className="text-neonGreen">Akun</span></h2>
                  <p className="text-gray-500 text-xs mt-2">Masukkan kredensial in-game agar booster kami dapat mengakses akun Anda.</p>
                </div>

                {/* Order summary mini card */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neonGreen/10 border border-neonGreen/20 flex items-center justify-center">
                        <Star className="w-5 h-5 text-neonGreen" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-orbitron tracking-widest uppercase">Pesanan Boost</p>
                        <p className="text-white text-sm font-bold">{RANK_CONFIG[state.current.id].name} → {RANK_CONFIG[state.target.id].name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 font-orbitron tracking-widest uppercase">Total</p>
                      <p className="text-neonGreen font-bold font-orbitron">{fmtIDR(pricing.total_price)}</p>
                    </div>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 font-orbitron tracking-widest uppercase pl-1">Game ID</label>
                      <input 
                        type="text" 
                        placeholder="123456789" 
                        className="w-full h-10 px-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-neonGreen/50 transition-colors"
                        value={state.formData.gameId}
                        onChange={e => updateState('formData', { ...state.formData, gameId: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 font-orbitron tracking-widest uppercase pl-1">Server ID</label>
                      <input 
                        type="text" 
                        placeholder="1234" 
                        className="w-full h-10 px-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-neonGreen/50 transition-colors"
                        value={state.formData.serverId}
                        onChange={e => updateState('formData', { ...state.formData, serverId: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-orbitron tracking-widest uppercase pl-1">WhatsApp</label>
                    <input 
                      type="text" 
                      placeholder="6281234567890" 
                      className="w-full h-10 px-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-neonGreen/50 transition-colors"
                      value={state.formData.whatsapp}
                      onChange={e => updateState('formData', { ...state.formData, whatsapp: e.target.value })}
                    />
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-orbitron tracking-widest uppercase pl-1">Metode Pembayaran</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['OVO', 'DANA', 'GoPay'].map((method) => (
                      <button
                        key={method}
                        className={`h-12 rounded-xl border text-sm font-orbitron font-bold tracking-wider transition-all ${
                          state.paymentMethod === method 
                            ? 'bg-neonGreen/10 border-neonGreen text-neonGreen shadow-glow' 
                            : 'bg-white/[0.02] border-white/10 text-gray-500 hover:border-white/20'
                        }`}
                        onClick={() => updateState('paymentMethod', method)}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    className="flex-1 h-12 rounded-xl border border-white/10 text-white hover:bg-white/5 font-orbitron text-xs uppercase tracking-widest transition-colors"
                    onClick={() => updateState('step', 0)}
                  >
                    ← Kembali
                  </button>
                  <button 
                    className="flex-1 h-12 rounded-xl bg-neonGreen text-dark font-bold font-orbitron text-xs uppercase tracking-widest hover:bg-neonGreen/90 transition-colors disabled:opacity-50"
                    disabled={!state.formData.gameId || !state.formData.serverId || !state.formData.whatsapp || !state.paymentMethod}
                    onClick={handleOrderSubmit}
                  >
                    {state.loading ? 'MEMPROSES...' : 'PESAN SEKARANG'}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
              <div className="w-20 h-20 mx-auto rounded-full bg-neonGreen/10 border border-neonGreen/30 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-neonGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-black font-orbitron uppercase tracking-wide text-white mb-3">Pesanan Berhasil!</h2>
              <p className="text-gray-400 max-w-sm mx-auto">
                Periksa dashboard Anda untuk melacak progres boost. Kami akan segera memulai pesanan Anda.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
