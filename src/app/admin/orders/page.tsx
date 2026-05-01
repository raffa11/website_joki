"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Search, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ManageOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders/list');
      const data = await res.json();
      
      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      setSelectedOrder(null);
      
      // Create a log entry
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (user) {
        await supabase.from('logs').insert({
          action: `status_update_${newStatus}`,
          order_id: id,
          user_id: user.id
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    
    const headers = ["Order ID", "Customer", "Game", "Rank", "Target", "Status", "Price", "Date"];
    const csvContent = [
      headers.join(","),
      ...orders.map(o => [
        o.id,
        o.user_name || "Unknown",
        o.game_name,
        o.current_rank,
        o.target_rank,
        o.status,
        o.price,
        new Date(o.created_at).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `boosttrack_orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.user_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.order_code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold font-orbitron text-white uppercase tracking-wide">
            ORDERS <span className="text-neon">LIST</span>
          </h1>
          <p className="text-gray-400 mt-1">Full database of customer boosting orders.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="border-cardHover text-gray-300" onClick={fetchOrders}>
            Refresh
          </Button>
          <Button variant="neon" size="sm" onClick={handleExportCSV} className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input 
            placeholder="Search by ID, Name or Order Code..." 
            className="bg-card/50 border-cardHover pl-10 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-cardHover text-gray-400 gap-2">
          <Filter className="w-4 h-4" /> Filters
        </Button>
      </div>

      <Card className="border-cardHover bg-card/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-darker/80 border-b border-cardHover">
              <tr>
                <th className="px-6 py-4 font-orbitron tracking-wider">Order ID</th>
                <th className="px-6 py-4 font-orbitron tracking-wider">Customer</th>
                <th className="px-6 py-4 font-orbitron tracking-wider">Service</th>
                <th className="px-6 py-4 font-orbitron tracking-wider">Status</th>
                <th className="px-6 py-4 font-orbitron tracking-wider text-right">Price</th>
                <th className="px-6 py-4 font-orbitron tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cardHover/30">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-neon">
                      <span className="w-8 h-8 rounded-full border-4 border-neon border-t-transparent animate-spin"></span>
                      <span className="font-orbitron text-xs tracking-widest">LOADING LIVE DATA...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-orbitron">
                    NO ORDERS MATCH YOUR SEARCH
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-mono text-neon text-xs">
                        {order.order_code || `#${order.id.substring(0, 8).toUpperCase()}`}
                      </div>
                      <div className="text-[10px] text-gray-600 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{order.user_name || "Anonymous"}</div>
                      <div className="text-[10px] text-gray-500">{order.phone || "No contact"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300 text-xs">
                        {order.current_rank} → <span className="text-white font-bold">{order.target_rank}</span>
                      </div>
                      <div className="text-[10px] text-accentBlue uppercase tracking-tighter mt-0.5">
                        {order.game_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                        order.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        order.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        order.status === 'paid' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-white font-bold font-orbitron">
                        IDR {Number(order.price).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase">{order.payment_status || 'unpaid'}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-cardHover hover:border-neon hover:text-neon text-xs group-hover:scale-105 transition-transform"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Action Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-dark border-neon/30 shadow-[0_0_50px_rgba(0,229,255,0.2)]">
            <CardHeader className="border-b border-cardHover">
              <CardTitle className="font-orbitron text-white">
                ORDER <span className="text-neon">MANAGEMENT</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="p-3 bg-darker rounded border border-cardHover">
                <div className="text-xs text-gray-500 uppercase font-orbitron">Customer Details</div>
                <div className="text-white font-bold">{selectedOrder.user_name || "Anonymous"}</div>
                <div className="text-xs text-gray-400 mt-1">{selectedOrder.phone}</div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase font-orbitron tracking-widest">Update Status</label>
                <select 
                  className="w-full bg-darker border border-cardHover rounded-md p-2.5 text-white focus:outline-none focus:border-neon transition-colors"
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                >
                  <option value="new">New</option>
                  <option value="paid">Paid</option>
                  <option value="in_progress">In Progress</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => setSelectedOrder(null)} className="text-gray-400">Cancel</Button>
                <Button variant="neon" onClick={() => setSelectedOrder(null)}>Done</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
