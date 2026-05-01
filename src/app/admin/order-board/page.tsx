"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  User,
  MessageCircle,
  ShieldCheck,
  Clock,
  ArrowRight,
  Eye
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
  { id: "orders", label: "📥 Orders", color: "border-yellow-500", bgColor: "bg-yellow-500/5", statuses: ["new", "paid"] },
  { id: "in_progress", label: "🎮 In Progress", color: "border-blue-500", bgColor: "bg-blue-500/5", statuses: ["in_progress"] },
  { id: "paused", label: "⏸ Paused", color: "border-orange-500", bgColor: "bg-orange-500/5", statuses: ["paused"] },
  { id: "completed", label: "✅ Completed", color: "border-neon", bgColor: "bg-neon/5", statuses: ["completed"] }
];

function SortableOrderCard({ order, progress, onStatusUpdate, onUpdateProgress, isDragging, onViewDetails }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: order.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      'new': { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'NEW' },
      'paid': { bg: 'bg-green-500/20', text: 'text-green-400', label: 'PAID' },
      'in_progress': { bg: 'bg-accentBlue/20', text: 'text-accentBlue', label: 'ACTIVE' },
      'paused': { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'PAUSED' },
      'completed': { bg: 'bg-neon/20', text: 'text-neon', label: 'DONE' }
    };
    return badges[status] || badges['new'];
  };

  const badge = getStatusBadge(order.status);
  const currentRankShort = order.current_rank?.split(' ')[0] || '';
  const targetRankShort = order.target_rank?.split(' ')[0] || '';

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative">
      <Card className={`bg-darker/90 border-cardHover hover:border-neon/30 transition-all cursor-grab active:cursor-grabbing group shadow-lg ${isDragging ? 'ring-2 ring-neon/50 scale-105' : ''}`}>
        <CardHeader className="p-3 pb-2 border-b border-white/5">
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-neon font-black text-[11px] font-orbitron tracking-wider truncate">
                  {order.order_code || `#${order.id.substring(0, 8).toUpperCase()}`}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[8px] text-gray-500 font-mono">
                <Clock className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate">{new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} border-current/20`}>
                {badge.label}
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); onViewDetails(order); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
              >
                <Eye className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-3 space-y-3">
          {/* Customer & Game Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-7 h-7 rounded-lg bg-card border border-cardHover flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-white text-[11px] font-bold leading-none truncate block">
                  {order.user_name || 'Anonymous'}
                </span>
                <span className="text-[9px] text-gray-500 font-mono">ID: {order.game_id || 'N/A'} | Server: {order.server_id || 'N/A'}</span>
              </div>
            </div>
            {order.phone && (
              <Link
                href={`https://wa.me/${order.phone}?text=${encodeURIComponent(`Hello, regarding your order ${order.order_code}`)}`}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20 hover:bg-green-500/20 transition-colors shrink-0"
              >
                <MessageCircle className="w-3.5 h-3.5 text-green-500" />
              </Link>
            )}
          </div>

          {/* Rank Progress Visualization */}
          <div className="bg-dark/40 rounded-lg border border-white/5 p-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-center flex-1 min-w-0">
                <p className="text-[8px] text-gray-500 uppercase font-orbitron mb-1">From</p>
                <p className="text-white text-[10px] font-bold truncate">{currentRankShort}</p>
              </div>
              <ArrowRight className="w-3 h-3 text-neon/60 shrink-0" />
              <div className="text-center flex-1 min-w-0">
                <p className="text-[8px] text-neon uppercase font-orbitron mb-1">Target</p>
                <p className="text-neon text-[10px] font-bold truncate">{targetRankShort}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-2 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[8px] text-gray-500 font-orbitron uppercase">Progress</span>
                <span className="text-neon font-black text-[10px]">{progress}%</span>
              </div>
              <div className="h-1.5 bg-darker rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${order.status === 'completed' ? 'from-green-500 to-green-400' : 'from-accentBlue to-neon'} transition-all duration-500`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-gray-600">
                <span>{order.stars_progress || 0} stars</span>
                <span>{order.stars_total || 0} total</span>
              </div>
            </div>
          </div>

          {/* Booster Assignment */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-gray-500 shrink-0" />
              <input 
                type="text" 
                placeholder="Assign booster..."
                className="flex-1 bg-dark/40 border border-white/10 rounded px-2 py-1 text-[9px] text-white focus:outline-none focus:border-neon/30 placeholder:text-gray-600"
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

          {/* Quick Action Buttons */}
          <div className="flex gap-1 flex-wrap">
            {order.status === 'new' && (
              <Button size="sm" className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 text-[9px] h-6 px-2 font-orbitron" onClick={(e) => { e.stopPropagation(); onStatusUpdate(order.id, 'paid'); }}>
                MARK PAID
              </Button>
            )}
            {order.status === 'paid' && (
              <Button size="sm" className="bg-accentBlue/20 hover:bg-accentBlue/30 text-accentBlue border border-accentBlue/30 text-[9px] h-6 px-2 font-orbitron" onClick={(e) => { e.stopPropagation(); onStatusUpdate(order.id, 'in_progress'); }}>
                START
              </Button>
            )}
            {order.status === 'in_progress' && (
              <>
                <Button size="sm" variant="outline" className="border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 text-[9px] h-6 px-2 font-orbitron" onClick={(e) => { e.stopPropagation(); onStatusUpdate(order.id, 'paused'); }}>
                  PAUSE
                </Button>
                <Button size="sm" className="bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30 text-[9px] h-6 px-2 font-orbitron" onClick={(e) => { e.stopPropagation(); onStatusUpdate(order.id, 'completed'); }}>
                  FINISH
                </Button>
              </>
            )}
            {order.status === 'paused' && (
              <Button size="sm" className="bg-accentBlue/20 hover:bg-accentBlue/30 text-accentBlue border border-accentBlue/30 text-[9px] h-6 px-2 font-orbitron" onClick={(e) => { e.stopPropagation(); onStatusUpdate(order.id, 'in_progress'); }}>
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
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

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
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
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
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, stars_progress: newProgress });
        }
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
      await updateOrderStatus(orderId, column.statuses[0]);
    }
  };

  const filteredOrders = useMemo(() => {
    let result = orders.filter(order => {
      // Status filter
      if (filterStatus !== "all" && order.status !== filterStatus) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const orderId = (order.id || '').toLowerCase();
        const userName = (order.user_name || '').toLowerCase();
        const orderCode = (order.order_code || '').toLowerCase();
        return orderId.includes(query) || userName.includes(query) || orderCode.includes(query);
      }
      return true;
    });

    // Sort
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === "price_high") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "price_low") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    }

    return result;
  }, [orders, searchQuery, filterStatus, sortBy]);

  const getOrdersByStatus = (statusId: string) => {
    return filteredOrders.filter(order => {
      const column = STATUS_COLUMNS.find(c => c.id === statusId);
      if (!column) return false;
      return column.statuses.includes(order.status);
    });
  };

  const calculateProgress = (starsDone: number, starsTotal: number) => {
    return starsTotal > 0 ? Math.round((starsDone / starsTotal) * 100) : 0;
  };

  const getStatusCount = (status: string) => {
    return orders.filter(o => o.status === status).length;
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
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 border-gray-700 text-gray-300 hover:bg-gray-800 gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-left w-4 h-4"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
                  BACK
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold font-orbitron text-white uppercase tracking-wide">
                  Order <span className="text-neon">Management</span>
                </h1>
                <p className="text-xs text-gray-500 mt-1">Track and manage all customer orders</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Stats */}
              <div className="hidden md:flex items-center gap-3 mr-4">
                <div className="text-center">
                  <p className="text-[9px] text-gray-500 uppercase font-orbitron">Total</p>
                  <p className="text-neon font-bold text-sm">{orders.length}</p>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="text-center">
                  <p className="text-[9px] text-gray-500 uppercase font-orbitron">Active</p>
                  <p className="text-blue-400 font-bold text-sm">{getStatusCount('in_progress')}</p>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="text-center">
                  <p className="text-[9px] text-gray-500 uppercase font-orbitron">Done</p>
                  <p className="text-green-400 font-bold text-sm">{getStatusCount('completed')}</p>
                </div>
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

          {/* Filters & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 bg-card/30 p-3 rounded-xl border border-white/5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by order code, name, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 bg-dark/50 border-cardHover text-white text-xs"
              />
            </div>
            
            <div className="flex gap-2">
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-9 px-3 bg-dark/50 border border-cardHover rounded-md text-white text-xs focus:outline-none focus:border-neon/30"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="paid">Paid</option>
                <option value="in_progress">In Progress</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>

              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 px-3 bg-dark/50 border border-cardHover rounded-md text-white text-xs focus:outline-none focus:border-neon/30"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_high">Price: High to Low</option>
                <option value="price_low">Price: Low to High</option>
              </select>
            </div>
          </div>

           {/* Order Columns */}
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 min-h-[calc(100vh-280px)]">
             {STATUS_COLUMNS.map((column) => {
               const columnOrders = getOrdersByStatus(column.id);
                
               return (
                 <div 
                   key={column.id} 
                   className="flex flex-col min-h-[350px]"
                   data-status={column.id}
                 >
                  <div className={`bg-card/40 backdrop-blur-sm rounded-xl border-t-4 ${column.color} border-2 border-white/10 p-3 flex flex-col h-full shadow-lg`}>
                    {/* Column Header */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${column.color.replace('border-', 'bg-')}`} />
                        <h3 className="font-orbitron font-bold text-[10px] text-white tracking-widest uppercase">
                          {column.label}
                        </h3>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${column.bgColor} ${column.color}`}>
                        {columnOrders.length}
                      </span>
                    </div>

                    {/* Orders List */}
                    <SortableContext
                      items={columnOrders.map(o => o.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar scrollbar-thin">
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
                              onViewDetails={setSelectedOrder}
                            />
                          );
                        })}
                        
                        {columnOrders.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-10 text-center space-y-2 opacity-30">
                            <p className="text-gray-500 text-[9px] font-orbitron uppercase">No orders</p>
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-card border border-cardHover rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold font-orbitron text-white">Order Details</h2>
                <p className="text-neon text-sm font-bold">{selectedOrder.order_code}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-[9px] uppercase font-orbitron">Customer</p>
                  <p className="text-white font-bold">{selectedOrder.user_name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[9px] uppercase font-orbitron">Status</p>
                  <p className="text-white font-bold">{selectedOrder.status}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[9px] uppercase font-orbitron">Game ID</p>
                  <p className="text-white font-mono">{selectedOrder.game_id}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[9px] uppercase font-orbitron">Server</p>
                  <p className="text-white font-mono">{selectedOrder.server_id}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[9px] uppercase font-orbitron">Current Rank</p>
                  <p className="text-white">{selectedOrder.current_rank}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[9px] uppercase font-orbitron">Target Rank</p>
                  <p className="text-neon font-bold">{selectedOrder.target_rank}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[9px] uppercase font-orbitron">Price</p>
                  <p className="text-neon font-bold">Rp {selectedOrder.price?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[9px] uppercase font-orbitron">Payment</p>
                  <p className="text-white">{selectedOrder.payment_method}</p>
                </div>
              </div>
              
              {selectedOrder.phone && (
                <a 
                  href={`https://wa.me/${selectedOrder.phone}`}
                  target="_blank"
                  className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg p-3 hover:bg-green-500/20 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-400 text-sm">Contact via WhatsApp: {selectedOrder.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </DndContext>
  );
}
