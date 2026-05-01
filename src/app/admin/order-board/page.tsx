"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  User,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  CheckCircle,
  MessageCircle,
  ShieldCheck,
  Clock,
  ExternalLink,
  MoreVertical
} from "lucide-react";
import Link from "next/link";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const STATUS_COLUMNS = [
  { id: "orders", label: "📥 Orders", color: "border-yellow-500", statuses: ["new", "paid"] },
  { id: "in_progress", label: "🎮 In Progress", color: "border-blue-500", statuses: ["in_progress"] },
  { id: "paused", label: "⏸ Paused", color: "border-orange-500", statuses: ["paused"] },
  { id: "completed", label: "✅ Completed", color: "border-neon", statuses: ["completed"] }
];

function SortableOrderCard({ order, progress, onStatusUpdate, onUpdateProgress, isDragging }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: order.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative">
      <Card className={`bg-darker/80 border-cardHover hover:border-neon/40 transition-all cursor-grab active:cursor-grabbing group shadow-lg ${isDragging ? 'ring-2 ring-neon/50 scale-105' : ''}`}>
        <CardHeader className="p-3 pb-2 border-b border-white/5">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-neon font-black text-xs font-orbitron tracking-wider">
                  {order.order_code || `#${order.id.substring(0, 8).toUpperCase()}`}
                </span>
                <Link href={`/admin/orders/${order.id}`} onClick={(e) => e.stopPropagation()} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3 h-3 text-gray-500 hover:text-neon" />
                </Link>
              </div>
              <div className="flex items-center gap-1 text-[8px] text-gray-500 uppercase font-orbitron">
                <Clock className="w-2.5 h-2.5" />
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border shadow-sm ${
              order.payment_status === 'paid' 
                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
            }`}>
              {order.payment_status || 'unpaid'}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-3 space-y-3">
          {/* Customer Info Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-card border border-cardHover flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-white text-[11px] font-bold leading-none truncate max-w-[100px]">
                  {order.user_name || 'Anonymous'}
                </span>
                <span className="text-[9px] text-gray-500 font-mono mt-0.5">{order.game_id || 'No ID'}</span>
              </div>
            </div>
            {order.phone && (
              <Link
                href={`https://wa.me/${order.phone}?text=${encodeURIComponent(`Hello, I'm from BoostTrack regarding your order ${order.order_code}`)}`}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20 hover:bg-green-500/20 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-green-500" />
              </Link>
            )}
          </div>

          {/* Rank Transition Card */}
          <div className="bg-dark/40 rounded-lg border border-white/5 p-2 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[8px] text-gray-500 uppercase font-orbitron tracking-widest px-1">
              <span>From</span>
              <span>Target</span>
            </div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-white text-[10px] font-bold truncate max-w-[70px]">{order.current_rank.split(' ')[0]}</span>
              <ArrowRight className="w-3 h-3 text-neon/40" />
              <span className="text-neon text-[10px] font-bold truncate max-w-[70px] text-right">{order.target_rank.split(' ')[0]}</span>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-0.5">
              <span className="text-[8px] text-gray-500 font-orbitron uppercase">Progress</span>
              <span className="text-neon font-black text-[10px]">{progress}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-darker rounded-full overflow-hidden border border-white/5">
                <div 
                  className={`h-full bg-gradient-to-r ${order.status === 'completed' ? 'from-green-500 to-green-400' : 'from-accentBlue to-neon'} transition-all duration-500 shadow-[0_0_8px_rgba(0,229,255,0.3)]`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); onUpdateProgress(order.id, Math.max(0, (order.stars_progress || 0) - 1)); }}
                  className="w-4 h-4 rounded bg-white/5 flex items-center justify-center hover:bg-white/10 text-gray-400 border border-white/10 text-[10px]"
                >
                  -
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onUpdateProgress(order.id, Math.min(order.stars_total || 999, (order.stars_progress || 0) + 1)); }}
                  className="w-4 h-4 rounded bg-white/5 flex items-center justify-center hover:bg-white/10 text-gray-400 border border-white/10 text-[10px]"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Booster Assignment */}
          <div className="pt-2 border-t border-white/5">
            <div className="relative group/input">
              <ShieldCheck className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 group-focus-within/input:text-neon transition-colors" />
              <input 
                type="text" 
                placeholder="Assign Booster..."
                className="w-full bg-dark/40 border border-white/10 rounded-md pl-7 pr-2 py-1.5 text-[9px] text-white focus:outline-none focus:border-neon/30 focus:bg-dark/60 transition-all placeholder:text-gray-600"
                defaultValue={order.booster || ""}
                onKeyDown={(e) => e.stopPropagation()}
                onBlur={async (e) => {
                  const name = e.target.value;
                  if (name !== order.booster) {
                    await fetch('/api/orders/update', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: order.id, booster: name })
                    });
                  }
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1.5">
            {order.status === 'new' && (
              <Button size="sm" className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 text-[9px] h-7 flex-1 font-orbitron" onClick={(e) => { e.stopPropagation(); onStatusUpdate(order.id, 'paid'); }}>
                PAID
              </Button>
            )}
            {order.status === 'paid' && (
              <Button size="sm" className="bg-accentBlue/20 hover:bg-accentBlue/30 text-accentBlue border border-accentBlue/30 text-[9px] h-7 flex-1 font-orbitron" onClick={(e) => { e.stopPropagation(); onStatusUpdate(order.id, 'in_progress'); }}>
                START
              </Button>
            )}
            {order.status === 'in_progress' && (
              <>
                <Button size="sm" variant="outline" className="border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 text-[9px] h-7 flex-1 font-orbitron" onClick={(e) => { e.stopPropagation(); onStatusUpdate(order.id, 'paused'); }}>
                  PAUSE
                </Button>
                <Button size="sm" className="bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30 text-[9px] h-7 flex-1 font-orbitron font-bold" onClick={(e) => { e.stopPropagation(); onStatusUpdate(order.id, 'completed'); }}>
                  FINISH
                </Button>
              </>
            )}
            {order.status === 'paused' && (
              <Button size="sm" className="bg-accentBlue/20 hover:bg-accentBlue/30 text-accentBlue border border-accentBlue/30 text-[9px] h-7 flex-1 font-orbitron" onClick={(e) => { e.stopPropagation(); onStatusUpdate(order.id, 'in_progress'); }}>
                RESUME
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminOrderBoard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders/list');
      const data = await res.json();
      
      if (!res.ok) {
        console.error("API Error:", data.error);
        // If we get an error, don't clear the orders if we already have some
        return;
      }
      
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Network Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/orders/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });
      
      if (res.ok) {
        setOrders(prev => 
          prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const updateOrderProgress = async (orderId: string, newProgress: number) => {
    try {
      const res = await fetch('/api/orders/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, stars_progress: newProgress })
      });
      
      if (res.ok) {
        setOrders(prev => 
          prev.map(o => o.id === orderId ? { ...o, stars_progress: newProgress } : o)
        );
      }
    } catch (error) {
      console.error("Error updating order progress:", error);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const orderId = active.id as string;
    const newStatus = over.id as string;

    const column = STATUS_COLUMNS.find(col => col.id === newStatus);
    if (column) {
      // Use the primary status for that column
      await updateOrderStatus(orderId, column.statuses[0]);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const orderId = order.id?.toLowerCase() || '';
      const userName = (order.user_name || '').toLowerCase();
      return orderId.includes(query) || userName.includes(query);
    }
    return true;
  });

  const getOrdersByStatus = (statusId: string) => {
    const column = STATUS_COLUMNS.find(c => c.id === statusId);
    if (!column) return [];
    return filteredOrders.filter(order => column.statuses.includes(order.status));
  };

  const calculateProgress = (starsDone: number, starsTotal: number) => {
    return starsTotal > 0 ? Math.round((starsDone / starsTotal) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-neon">
          <span className="w-8 h-8 rounded-full border-4 border-neon border-t-transparent animate-spin"></span>
          <span className="font-orbitron font-bold tracking-widest text-sm animate-pulse">LOADING ORDERS...</span>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-dark p-3 md:p-6">
        <div className="w-full mx-auto space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold font-orbitron text-white uppercase tracking-wide">
                ORDER <span className="text-neon">BOARD</span>
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-8 bg-card border-cardHover text-white text-xs"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 border-cardHover text-gray-300 hover:bg-card text-xs"
                onClick={fetchOrders}
              >
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[calc(100vh-140px)]">
            {STATUS_COLUMNS.map((column) => {
              const columnOrders = getOrdersByStatus(column.id);
              
              return (
                <div 
                  key={column.id} 
                  className="flex flex-col min-h-[400px]"
                  data-status={column.id}
                >
                  <div className={`bg-card/40 backdrop-blur-sm rounded-xl border-t-2 ${column.color} border-x border-b border-white/5 p-2.5 flex flex-col h-full shadow-lg`}>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${column.color.replace('border-', 'bg-')}`} />
                        <h3 className="font-orbitron font-bold text-[10px] text-white tracking-widest uppercase">
                          {column.label.split(' ')[1]} {column.label.split(' ')[2] || ''}
                        </h3>
                      </div>
                      <span className="bg-white/5 text-neon text-[9px] font-bold px-1.5 py-0.5 rounded border border-neon/10">
                        {columnOrders.length}
                      </span>
                    </div>

                    <SortableContext
                      items={columnOrders.map(o => o.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="flex-1 space-y-2.5 overflow-y-auto pr-1 custom-scrollbar">
                        {columnOrders.map((order) => {
                          const progress = calculateProgress(order.stars_progress || 0, order.stars_total || 1);
                          return (
                            <SortableOrderCard
                              key={order.id}
                              order={order}
                              progress={progress}
                              onStatusUpdate={updateOrderStatus}
                              onUpdateProgress={updateOrderProgress}
                              isDragging={activeId === order.id}
                            />
                          );
                        })}
                        
                        {columnOrders.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-10 text-center space-y-2 opacity-20">
                            <Search className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-500 text-[9px] font-orbitron">No orders</span>
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
