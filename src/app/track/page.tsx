"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Search, 
  Package, 
  Clock, 
  CheckCircle2, 
  MessageCircle, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";

import { Suspense } from "react";

function TrackContent() {
  const searchParams = useSearchParams();
  const [orderCode, setOrderCode] = useState(searchParams.get("code") || "");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (orderCode) {
      handleTrack();
    }
  }, []);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderCode) return;

    try {
      setLoading(true);
      setError("");
      
      const { data, error: sbError } = await supabase
        .from("orders")
        .select("*")
        .eq("order_code", orderCode.toUpperCase().trim())
        .single();

      if (sbError || !data) {
        setError("Order not found. Please check your Order Code.");
        setOrder(null);
      } else {
        setOrder(data);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "paid": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "in_progress": return "text-neonGreen bg-neonGreen/10 border-neonGreen/20 shadow-[0_0_15px_rgba(0,255,135,0.15)]";
      case "completed": return "text-purple-400 bg-purple-400/10 border-purple-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new": return "Waiting for Payment";
      case "paid": return "Paid - Queueing";
      case "in_progress": return "Boosting in Progress";
      case "completed": return "Order Completed";
      default: return status.toUpperCase();
    }
  };

  const progressPercentage = order ? (order.stars_progress / order.stars_total) * 100 : 0;
  const isJustCreated = searchParams.get("success") === "true";

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-neonGreen/30">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-neonGreen/10 border border-neonGreen/20 text-neonGreen text-[10px] font-orbitron tracking-[0.2em] uppercase mb-4"
          >
            Real-time Updates
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black font-orbitron tracking-tight mb-4"
          >
            TRACK YOUR <span className="text-neonGreen">BOOST</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm max-w-md mx-auto"
          >
            Enter your Order Code below to see your boosting progress and current status.
          </motion.p>
        </div>

        {/* Success Alert */}
        <AnimatePresence>
          {isJustCreated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="max-w-lg mx-auto mb-10 p-6 rounded-3xl bg-green-500/10 border border-green-500/20 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold font-orbitron text-white mb-2">Order Confirmed!</h3>
              <p className="text-gray-400 text-sm mb-4">Your payment was successful and your order has been placed.</p>
              <div className="inline-block px-4 py-2 bg-white/5 rounded-xl border border-white/10 font-orbitron text-neonGreen font-bold">
                CODE: {orderCode}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleTrack}
          className="relative max-w-lg mx-auto mb-16"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-neonGreen/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden focus-within:border-neonGreen/50 transition-all">
              <Search className="w-5 h-5 text-gray-500 ml-5" />
              <input
                type="text"
                placeholder="Enter Order Code (e.g. ML-123456)"
                className="w-full h-16 bg-transparent px-4 text-white font-orbitron tracking-wider focus:outline-none placeholder:text-gray-600"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
              />
              <button 
                type="submit"
                disabled={loading}
                className="h-12 mr-2 px-6 rounded-xl bg-neonGreen text-black font-orbitron text-xs font-black tracking-widest hover:scale-95 transition-transform disabled:opacity-50"
              >
                {loading ? "SEARCHING..." : "TRACK"}
              </button>
            </div>
          </div>
          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-400 text-center text-xs mt-4 font-medium"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>

        <AnimatePresence mode="wait">
          {order ? (
            <motion.div
              key="order-result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Order Header Card */}
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-orbitron">Order Code</p>
                    <h3 className="text-2xl font-black font-orbitron text-white">{order.order_code}</h3>
                  </div>
                  
                  <div className={`px-4 py-2 rounded-xl border text-[11px] font-orbitron font-bold tracking-widest uppercase ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-neonGreen" />
                      </div>
                      <span className="text-xs uppercase tracking-widest font-orbitron">Progress</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <p className="text-3xl font-black font-orbitron text-white">{order.stars_progress}<span className="text-gray-600 text-lg ml-1">/ {order.stars_total} ★</span></p>
                        <p className="text-neonGreen font-orbitron font-bold text-sm">{Math.round(progressPercentage)}%</p>
                      </div>
                      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          className="h-full bg-neonGreen shadow-[0_0_15px_rgba(0,255,135,0.5)]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Package className="w-4 h-4 text-accentBlue" />
                      </div>
                      <span className="text-xs uppercase tracking-widest font-orbitron">Rank Target</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-white">
                        <p className="text-[10px] text-gray-500 font-orbitron uppercase mb-0.5">Current → Target</p>
                        <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                          <span className="text-gray-400">{order.current_rank.split('(')[0]}</span>
                          <ChevronRight className="w-4 h-4 text-neonGreen" />
                          <span className="text-white">{order.target_rank.split('(')[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-yellow-500" />
                      </div>
                      <span className="text-xs uppercase tracking-widest font-orbitron">Booster Info</span>
                    </div>
                    <div>
                      <p className="text-white font-bold">{order.booster || "Waiting Assignment"}</p>
                      <p className="text-[10px] text-gray-500 font-orbitron uppercase">{order.booster ? "Professional Athlete" : "Queueing"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-orbitron uppercase">Ordered On</p>
                      <p className="text-xs text-white font-medium">{new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>

                  <a 
                    href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Hello Admin, I want to ask about my order ${order.order_code}`)}`}
                    target="_blank" 
                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/5 transition-colors group"
                  >
                    <MessageCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-orbitron font-bold tracking-widest">CONTACT ADMIN</span>
                  </a>
                </div>
              </div>

              {/* Success Banner if Completed */}
              {order.status === "completed" && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-r from-neonGreen to-accentBlue p-px rounded-3xl overflow-hidden"
                >
                  <div className="bg-black/90 p-8 rounded-[23px] flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="w-16 h-16 rounded-full bg-neonGreen/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-8 h-8 text-neonGreen" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black font-orbitron text-white mb-1">BOOST COMPLETED!</h4>
                      <p className="text-gray-400 text-sm">Your order has been successfully processed. You can now enjoy your new rank.</p>
                    </div>
                    <button className="md:ml-auto px-8 py-4 rounded-xl bg-neonGreen text-black font-black font-orbitron text-xs tracking-widest">
                      WRITE REVIEW
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : !loading && !error && searchParams.get("code") ? (
            <div className="text-center py-20 text-gray-600 font-orbitron uppercase tracking-widest animate-pulse">
              Initializing...
            </div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Background Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-neonGreen/5 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-accentBlue/5 blur-[120px] pointer-events-none -z-10" />
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-neonGreen font-orbitron animate-pulse">LOADING TRACKING SYSTEM...</div>}>
      <TrackContent />
    </Suspense>
  );
}
