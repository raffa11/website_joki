"use client";

import { useState } from "react";
import { User, Shield, Zap, TrendingUp, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_BOOSTERS = [
  { id: 1, name: "ShadowHunter", rank: "Mythical Glory", orders: 1245, winrate: 92, rating: 5.0, type: "Mythic", avatar: "bg-purple-900/30", color: "text-purple-400" },
  { id: 2, name: "SkyWalker", rank: "Mythical Glory", orders: 856, winrate: 90, rating: 5.0, type: "Mythic", avatar: "bg-blue-900/30", color: "text-blue-400" },
  { id: 3, name: "NightFury", rank: "Mythical Glory", orders: 756, winrate: 88, rating: 5.0, type: "Mythic", avatar: "bg-indigo-900/30", color: "text-indigo-400" },
  { id: 4, name: "DragonSlayer", rank: "Mythic", orders: 351, winrate: 91, rating: 4.9, type: "Mythic", avatar: "bg-red-900/30", color: "text-red-400" },
  { id: 5, name: "PhantomAssassin", rank: "Legend I", orders: 420, winrate: 85, rating: 4.8, type: "Legend", avatar: "bg-yellow-900/30", color: "text-yellow-400" },
  { id: 6, name: "SilentKiller", rank: "Epic I", orders: 215, winrate: 82, rating: 4.7, type: "Epic", avatar: "bg-green-900/30", color: "text-green-400" },
];

const FILTERS = ["All", "Mythic", "Legend", "Epic"];

export default function BoostersPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  
  const filteredBoosters = MOCK_BOOSTERS.filter(b => 
    activeFilter === "All" ? true : b.type === activeFilter
  );

  return (
    <div className="min-h-screen bg-dark text-white font-poppins relative">
      
      {/* Navbar placeholder - typically handled by layout but we add header here */}
      <header className="border-b border-cardHover/50 bg-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-neon drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
            <span className="text-2xl font-bold font-orbitron text-white tracking-wider cursor-pointer" onClick={() => window.location.href='/'}>
              BOOST<span className="text-neon drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">TRACK</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Home</a>
            <a href="/boosters" className="text-sm font-medium text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]">Boosters</a>
            <a href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Dashboard</a>
          </nav>
        </div>
      </header>

      {/* Background Gradients */}
      <div className="absolute top-[10%] left-[-10%] w-[30%] h-[30%] bg-accentBlue/20 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-neon/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <main className="container mx-auto px-4 py-16 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-bold font-orbitron uppercase tracking-widest drop-shadow-md">
            OUR PROFESSIONAL <span className="text-neon drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]">BOOSTERS</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Boosted by top global players you can trust. Select a booster to view their profile or hire them instantly.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-card/40 p-4 rounded-2xl border border-cardHover/50 backdrop-blur-sm">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full font-orbitron text-sm tracking-wider transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-accentBlue text-white shadow-[0_0_15px_rgba(30,144,255,0.5)]"
                    : "bg-darker text-gray-400 border border-cardHover hover:border-accentBlue/50 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search booster..." 
              className="w-full bg-darker border border-cardHover rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-neon focus:shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all"
            />
          </div>
        </div>

        {/* Booster Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBoosters.map((booster) => (
            <div 
              key={booster.id} 
              className="bg-card/80 border border-cardHover rounded-2xl p-6 backdrop-blur-md hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,229,255,0.15)] hover:border-neon/50 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-transparent group-hover:border-neon/50 transition-colors ${booster.avatar}`}>
                    <User className={`w-8 h-8 ${booster.color}`} />
                  </div>
                  <div>
                    <h3 className="font-orbitron font-bold text-lg tracking-wide text-white group-hover:text-neon transition-colors">{booster.name}</h3>
                    <p className="text-xs font-semibold text-gray-400 bg-darker px-2 py-1 rounded-md inline-block mt-1 border border-gray-800">
                      {booster.rank}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-lg border border-yellow-500/20">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold">{booster.rating}</span>
                </div>
              </div>

              {/* Stats Reveal */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-darker p-3 rounded-xl border border-cardHover/50 text-center group-hover:bg-cardHover transition-colors">
                  <p className="text-[10px] text-gray-400 font-orbitron tracking-widest mb-1">WINRATE</p>
                  <p className="text-xl font-bold text-accentBlue drop-shadow-[0_0_5px_rgba(30,144,255,0.5)] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 mr-1 text-accentBlue" />
                    {booster.winrate}%
                  </p>
                </div>
                <div className="bg-darker p-3 rounded-xl border border-cardHover/50 text-center group-hover:bg-cardHover transition-colors">
                  <p className="text-[10px] text-gray-400 font-orbitron tracking-widest mb-1">ORDERS</p>
                  <p className="text-xl font-bold text-white flex items-center justify-center">
                    <Shield className="w-4 h-4 mr-1 text-gray-400" />
                    {booster.orders}
                  </p>
                </div>
              </div>

              <Button className="w-full bg-transparent border border-neon text-neon hover:bg-neon hover:text-dark font-bold tracking-widest rounded-xl py-6 transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)]">
                VIEW PROFILE
              </Button>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
