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

/* ── Asset Constants ────────────────────────────────────────── */
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
    if (!state.paymentMethod) return alert("Select payment method");
    
    try {
      updateState('loading', true);
      
      // Check if user is logged in before submitting
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (confirm("You must be logged in to place an order. Redirect to login page?")) {
          window.location.href = "/login?redirect=pricing-section";
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
      else alert(data.error || "Order submission failed");
    } catch (error) {
      alert("Submission failed. Please try again.");
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
                  <span className="text-[13px] font-orbitron font-bold tracking-widest uppercase text-white mb-2">Current Rank</span>
                  <div className="flex items-center gap-6 h-14 mt-2">
                    <TierCarousel value={state.current.tier} tiers={getTierList(state.current.id)} onChange={(tier: number) => updateRank('current', { tier })} />
                    <StarCarousel value={state.current.star} maxStars={currentMaxStars} onChange={(star: number) => updateRank('current', { star })} label="Stars" rankId={state.current.id} />
                  </div>
                  <RankCarousel rankId={state.current.id} onRankChange={(id: string) => updateRank('current', { id, tier: getTierList(id)[0], star: getRankMinStars(id) })} />
                </div>

                <div className="flex items-center justify-center lg:pt-40"><ArrowRight className="w-6 h-6 text-neonGreen lg:rotate-0 rotate-90" /></div>

                <div className="flex flex-col items-center flex-1 w-full">
                  <span className="text-[13px] font-orbitron font-bold tracking-widest uppercase text-white mb-2">Target Rank</span>
                  <div className="flex items-center gap-6 h-14 mt-2">
                    <TierCarousel value={state.target.tier} tiers={getTierList(state.target.id)} onChange={(tier: number) => updateRank('target', { tier })} />
                    <StarCarousel value={state.target.star} maxStars={targetMaxStars} onChange={(star: number) => updateRank('target', { star })} label="Stars" rankId={state.target.id} />
                  </div>
                  <RankCarousel rankId={state.target.id} onRankChange={(id: string) => updateRank('target', { id, tier: getTierList(id)[0], star: getRankMinStars(id) })} />
                </div>
              </div>

              <div className="mt-12 flex flex-col items-center border-t border-white/5 pt-10">
                <div className="grid grid-cols-2 gap-20 mb-8">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-orbitron mb-1">Stars Needed</p>
                    <p className="text-4xl font-black text-white font-orbitron">{pricing.stars_needed}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-orbitron mb-1">Total Price</p>
                    <p className="text-4xl font-black text-neonGreen font-orbitron glow-green">{fmtIDR(pricing.total_price)}</p>
                  </div>
                </div>
                <button 
                  className="btn-solid-neon w-full max-w-md h-14 rounded-xl uppercase tracking-widest text-sm disabled:opacity-50" 
                  disabled={pricing.total_price <= 0} 
                  onClick={async () => {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session) {
                      if (confirm("You must be logged in to place an order. Redirect to login page?")) {
                        window.location.href = "/login?redirect=pricing-section";
                      }
                      return;
                    }
                    updateState('step', 1);
                  }}
                >
                  Next Step →
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
                    <span className="text-[10px] text-neonGreen font-orbitron tracking-widest uppercase hidden sm:inline">Details</span>
                  </div>
                  <div className="w-8 h-px bg-white/10"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 text-[10px] font-orbitron font-bold">3</div>
                    <span className="text-[10px] text-gray-500 font-orbitron tracking-widest uppercase hidden sm:inline">Pay</span>
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-bold font-orbitron uppercase tracking-wide">Account <span className="text-neonGreen">Details</span></h2>
                  <p className="text-gray-500 text-xs mt-2">Enter your in-game credentials so our booster can access your account.</p>
                </div>

                {/* Order summary mini card */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neonGreen/10 border border-neonGreen/20 flex items-center justify-center">
                        <Star className="w-5 h-5 text-neonGreen" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-orbitron tracking-widest uppercase">Boost Order</p>
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
                      <input placeholder="e.g. 123456789" className="input-field" value={state.formData.gameId} onChange={e => updateState('formData', { ...state.formData, gameId: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 font-orbitron tracking-widest uppercase pl-1">Server ID</label>
                      <input placeholder="e.g. 2489" className="input-field" value={state.formData.serverId} onChange={e => updateState('formData', { ...state.formData, serverId: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-orbitron tracking-widest uppercase pl-1">WhatsApp Number</label>
                    <input placeholder="e.g. 08123456789" className="input-field" value={state.formData.whatsapp} onChange={e => updateState('formData', { ...state.formData, whatsapp: e.target.value })} />
                    <p className="text-[9px] text-gray-600 pl-1">We&apos;ll send order updates to this number.</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button className="btn-neon flex-1 h-12 rounded-xl uppercase tracking-widest text-xs" onClick={() => updateState('step', 0)}>← Back</button>
                  <button className="btn-solid-neon flex-[2] h-12 rounded-xl uppercase tracking-widest text-xs disabled:opacity-40" 
                    disabled={!state.formData.gameId || !state.formData.serverId || !state.formData.whatsapp}
                    onClick={() => updateState('step', 2)}>Continue to Payment →</button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="pay" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="max-w-lg mx-auto space-y-8">
                {/* Step indicator */}
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-neonGreen/20 border border-neonGreen/40 flex items-center justify-center text-neonGreen text-[10px] font-orbitron font-bold">1</div>
                    <span className="text-[10px] text-gray-500 font-orbitron tracking-widest uppercase hidden sm:inline">Rank</span>
                  </div>
                  <div className="w-8 h-px bg-neonGreen/30"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-neonGreen/20 border border-neonGreen/40 flex items-center justify-center text-neonGreen text-[10px] font-orbitron font-bold">2</div>
                    <span className="text-[10px] text-gray-500 font-orbitron tracking-widest uppercase hidden sm:inline">Details</span>
                  </div>
                  <div className="w-8 h-px bg-neonGreen/30"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-neonGreen border border-neonGreen flex items-center justify-center text-dark text-[10px] font-orbitron font-bold">3</div>
                    <span className="text-[10px] text-neonGreen font-orbitron tracking-widest uppercase hidden sm:inline">Pay</span>
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-bold font-orbitron uppercase tracking-wide">Select <span className="text-neonGreen">Payment</span></h2>
                  <p className="text-gray-500 text-xs mt-2">Choose your preferred payment method to confirm the order.</p>
                </div>

                {/* Payment method selection */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'QRIS', label: 'QRIS', desc: 'Scan & Pay', icon: '📱' },
                    { id: 'Bank Transfer', label: 'Transfer', desc: 'BCA / BRI / Mandiri', icon: '🏦' },
                    { id: 'E-Wallet', label: 'E-Wallet', desc: 'GoPay / OVO / DANA', icon: '💳' },
                    { id: 'WhatsApp', label: 'WhatsApp', desc: 'Manual Payment', icon: '💬' },
                  ].map(p => (
                    <button key={p.id}
                      className={`relative p-4 rounded-2xl border transition-all text-left group overflow-hidden ${
                        state.paymentMethod === p.id 
                          ? 'bg-neonGreen/10 border-neonGreen shadow-[0_0_20px_rgba(0,255,135,0.1)]' 
                          : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                      onClick={() => updateState('paymentMethod', p.id)}
                    >
                      {state.paymentMethod === p.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-neonGreen flex items-center justify-center">
                          <span className="text-dark text-[10px] font-bold">✓</span>
                        </div>
                      )}
                      <span className="text-2xl mb-2 block">{p.icon}</span>
                      <p className="font-bold font-orbitron text-sm tracking-wide text-white">{p.label}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{p.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Order summary */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-3">
                  <p className="text-[10px] text-gray-500 font-orbitron tracking-widest uppercase">Order Summary</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Rank Boost</span><span className="text-white">{RANK_CONFIG[state.current.id].name} → {RANK_CONFIG[state.target.id].name}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Stars Needed</span><span className="text-white font-bold">{pricing.stars_needed} ⭐</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Game ID</span><span className="text-white font-mono text-xs">{state.formData.gameId} ({state.formData.serverId})</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">WhatsApp</span><span className="text-white">{state.formData.whatsapp}</span></div>
                    {state.paymentMethod && <div className="flex justify-between"><span className="text-gray-400">Payment</span><span className="text-neonGreen font-bold">{state.paymentMethod}</span></div>}
                  </div>
                  <div className="border-t border-white/[0.06] pt-3 mt-3">
                    <div className="flex justify-between items-end">
                      <span className="text-gray-400 text-sm">Total</span>
                      <span className="text-2xl font-black font-orbitron text-neonGreen glow-green">{fmtIDR(pricing.total_price)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="btn-neon flex-1 h-14 rounded-xl uppercase tracking-widest text-xs" onClick={() => updateState('step', 1)}>← Back</button>
                  <button className="btn-solid-neon flex-[2] h-14 rounded-xl uppercase tracking-widest text-sm disabled:opacity-40"
                    disabled={!state.paymentMethod || state.loading}
                    onClick={handleOrderSubmit}
                  >
                    {state.loading ? "PROCESSING..." : "PLACE ORDER →"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}