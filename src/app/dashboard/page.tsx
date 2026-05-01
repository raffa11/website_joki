"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, MessageCircle, ChevronDown, User, Activity, Zap, Trophy, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

function OrderCard({ order, userName }: { order: any; userName: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const fetchLogs = async () => {
    if (logs.length > 0 || loadingLogs) return;
    try {
      setLoadingLogs(true);
      const { data } = await supabase
        .from('logs')
        .select('*')
        .eq('order_id', order.id)
        .order('created_at', { ascending: false });
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const toggleExpand = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    if (newExpanded) {
      fetchLogs();
    }
  };

  const isCompleted = order.status === 'completed';
  const displayId = order.id.substring(0, 8).toUpperCase();
  const progress = order.progress_percentage || (isCompleted ? 100 : 0);
  const boosterName = order.booster || "Pending Assignment";

  return (
    <Card className={`bg-card/80 border-cardHover backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden rounded-2xl transition-all hover:shadow-[0_0_50px_rgba(0,229,255,0.1)] ${isCompleted ? 'opacity-90' : ''}`}>
      {!isCompleted && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accentBlue via-neon to-accentBlue bg-[length:200%_auto] animate-gradient"></div>
      )}
      
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-cardHover/50 relative z-10">
        <div>
          <CardTitle className="text-xl font-orbitron text-white tracking-wide flex items-center gap-2">
            ORDER <span className="text-neon">#{displayId}</span>
            {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500" />}
          </CardTitle>
          <p className="text-[10px] text-gray-500 font-mono mt-1">{order.id}</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-xs font-orbitron font-bold tracking-widest border flex items-center gap-2 mt-2 sm:mt-0 shadow-lg ${
          isCompleted 
            ? 'bg-green-500/10 text-green-400 border-green-500/30' 
            : 'bg-neon/10 text-neon border-neon/30'
        }`}>
          {!isCompleted && <span className="w-2 h-2 rounded-full bg-neon animate-pulse"></span>}
          {order.status.replace('_', ' ').toUpperCase()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8 pt-6 relative z-10">
        {/* Rank Visualizer */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-darker/60 p-6 rounded-xl border border-cardHover/50 shadow-inner">
          <div className="text-center w-full md:w-1/3">
            <p className="text-xs text-gray-400 mb-2 font-orbitron tracking-widest uppercase">From</p>
            <div className="w-16 h-16 mx-auto mb-3 bg-card border border-cardHover rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <ShieldAlert className="w-8 h-8 text-gray-500" />
            </div>
            <p className="font-bold text-lg text-white">{order.current_rank}</p>
          </div>
          
          <div className="flex-1 w-full px-8 py-6 md:py-0 relative flex items-center justify-center">
            <div className="w-full h-[2px] bg-cardHover relative">
              <div 
                className={`absolute top-1/2 left-0 h-full shadow-[0_0_10px_rgba(0,229,255,0.8)] transition-all duration-1000 ${isCompleted ? 'bg-green-500' : 'bg-neon'}`} 
                style={{ width: `${progress}%` }}
              ></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-card border border-cardHover rounded-full flex items-center justify-center z-10 shadow-xl">
                {isCompleted ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Zap className="w-4 h-4 text-neon fill-neon/20" />}
              </div>
            </div>
          </div>
          
          <div className="text-center w-full md:w-1/3">
            <p className="text-xs text-neon mb-2 font-orbitron tracking-widest drop-shadow-[0_0_2px_rgba(0,229,255,0.5)] uppercase">To</p>
            <div className="w-16 h-16 mx-auto mb-3 bg-card border border-neon/50 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.2)]">
              <Trophy className={`w-8 h-8 ${isCompleted ? 'text-green-400' : 'text-neon'} drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]`} />
            </div>
            <p className="font-bold text-lg text-white">{order.target_rank}</p>
          </div>
        </div>

        {/* Progress Bar & Booster Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-orbitron">
              <span className="text-gray-400 tracking-widest uppercase">Completion Progress</span>
              <span className={`${isCompleted ? 'text-green-400' : 'text-neon'} font-bold`}>{progress}%</span>
            </div>
            <div className="w-full h-3 bg-darker rounded-full overflow-hidden border border-cardHover relative">
              <div 
                className={`h-full relative transition-all duration-1000 ease-out ${isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-accentBlue to-neon'}`} 
                style={{ width: `${progress}%` }}
              >
                {!isCompleted && <div className="absolute top-0 left-0 h-full w-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-500 uppercase">{order.game_name}</span>
              <p className="text-[10px] text-gray-400">{order.stars_progress || 0} / {order.stars_total || 0} Stars Achieved</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-darker/60 p-4 rounded-xl border border-cardHover/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-card border border-neon/30 flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-orbitron tracking-wider uppercase">Active Booster</p>
                <p className="font-bold text-white text-sm">{boosterName}</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-neon/30 text-neon hover:bg-neon/10 hover:text-neon rounded-full px-4 h-8 text-xs font-bold font-orbitron tracking-widest">
              CHAT
            </Button>
          </div>
        </div>

        {/* Activity Log Dropdown */}
        <div className="border border-cardHover rounded-xl overflow-hidden bg-darker/40">
          <button 
            onClick={toggleExpand}
            className="w-full flex items-center justify-between p-4 bg-card/50 hover:bg-card transition-colors"
          >
            <div className="flex items-center gap-2 font-orbitron text-sm font-bold tracking-wider text-gray-300 uppercase">
              <Activity className="w-4 h-4 text-accentBlue" />
              Activity Log
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          {isExpanded && (
            <div className="p-6 space-y-6 border-t border-cardHover/50">
              {loadingLogs ? (
                 <div className="flex justify-center py-4">
                   <div className="w-5 h-5 border-2 border-neon border-t-transparent rounded-full animate-spin"></div>
                 </div>
              ) : logs.length > 0 ? logs.map((log) => (
                <div key={log.id} className="flex justify-between items-start text-sm border-l-2 border-neon/30 pl-4 relative">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-neon shadow-[0_0_8px_rgba(0,229,255,0.8)]"></div>
                  <div>
                    <span className="text-white font-medium block uppercase tracking-wider text-xs">{log.action.replace('_', ' ')}</span>
                    <span className="text-gray-500 text-[10px]">{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                </div>
              )) : (
                <p className="text-center text-gray-500 text-xs py-4 italic uppercase">No recent activity logs found.</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Player");

  useEffect(() => {
    const initDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        fetchUserDataAndOrders(session.user);
      } else {
        setLoading(false);
      }
    };
    initDashboard();
  }, []);

  const fetchUserDataAndOrders = async (user: any) => {
    try {
      setLoading(true);
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();
          
      if (profile?.full_name) {
        setUserName(profile.full_name);
      }

      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(orders || []);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto font-poppins relative pb-20 p-4">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-accentBlue/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-neon/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold font-orbitron text-white uppercase tracking-wide drop-shadow-md">
            MY BOOST <span className="text-neon">PIPELINE</span>
          </h1>
          <p className="text-gray-400 mt-2">Welcome back, {userName}. Manage all your boosting accounts here.</p>
        </div>
        <Link href="/">
          <Button className="bg-neon hover:bg-neon/80 text-dark font-bold rounded-full px-8 shadow-[0_0_20px_rgba(0,229,255,0.4)]">
            NEW ORDER +
          </Button>
        </Link>
      </div>

      {loading ? (
        <Card className="p-20 flex justify-center items-center bg-card/50 border-cardHover backdrop-blur-md rounded-2xl border-dashed">
          <div className="flex flex-col items-center gap-4 text-neon">
            <span className="w-10 h-10 rounded-full border-4 border-neon border-t-transparent animate-spin shadow-[0_0_15px_rgba(0,229,255,0.5)]"></span>
            <span className="font-orbitron font-bold tracking-widest text-sm animate-pulse uppercase">Syncing Quantum Data...</span>
          </div>
        </Card>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {orders.length > 0 ? (
              orders.map((order) => (
                <OrderCard key={order.id} order={order} userName={userName} />
              ))
            ) : (
              <Card className="border-cardHover border-dashed bg-card/20 p-20 text-center rounded-2xl backdrop-blur-sm border-2">
                <CardContent className="space-y-6 flex flex-col items-center">
                  <div className="w-24 h-24 bg-darker rounded-full flex items-center justify-center border-2 border-cardHover shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <ShieldAlert className="w-12 h-12 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-orbitron text-white tracking-widest uppercase mb-2">No Active Orders</h3>
                    <p className="text-gray-400 max-sm mx-auto text-sm">Your boosting pipeline is empty. Launch a new order to climb the ranks!</p>
                  </div>
                  <Link href="/">
                    <Button className="bg-neon hover:bg-neon/80 text-dark font-bold rounded-full px-10 py-6 text-lg shadow-[0_0_30px_rgba(0,229,255,0.3)] mt-4">
                      START RANKING UP
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-50 group">
        <div className="absolute inset-0 bg-accentBlue/30 rounded-full blur-xl group-hover:bg-neon/40 transition-colors pointer-events-none"></div>
        <button className="relative w-16 h-16 bg-accentBlue hover:bg-neon text-white hover:text-dark rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(30,144,255,0.4)] transition-all hover:scale-110 duration-300">
          <MessageCircle className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-dark">2</span>
        </button>
      </div>
    </div>
  );
}
