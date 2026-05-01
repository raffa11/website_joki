"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, User, Trash2, Search, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users/list');
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role");
    }
  };

  const filteredUsers = users.filter(u => 
    (u.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button 
              variant="outline" 
              size="sm"
              className="h-10 px-4 border-gray-700 text-gray-300 hover:bg-gray-800 gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-left w-4 h-4"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
              BACK
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-orbitron text-white uppercase tracking-wide">
              USERS & <span className="text-neon">BOOSTERS</span>
            </h1>
            <p className="text-gray-400 mt-1">Manage platform accounts and permissions.</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="h-10 px-4 border-cardHover text-gray-300 hover:bg-card"
          onClick={fetchUsers}
        >
          Refresh
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input 
            placeholder="Search users..." 
            className="bg-card/50 border-cardHover pl-10 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-cardHover text-gray-400 gap-2">
          <Filter className="w-4 h-4" /> All Roles
        </Button>
      </div>

      <div className="rounded-xl border text-gray-100 shadow-sm border-cardHover bg-card/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-darker/80 border-b border-cardHover">
              <tr>
                <th className="px-6 py-4 font-orbitron tracking-wider">User</th>
                <th className="px-6 py-4 font-orbitron tracking-wider">Role</th>
                <th className="px-6 py-4 font-orbitron tracking-wider">Join Date</th>
                <th className="px-6 py-4 font-orbitron tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cardHover/30">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-neon">
                      <span className="w-8 h-8 rounded-full border-4 border-neon border-t-transparent animate-spin"></span>
                      <span className="font-orbitron text-xs tracking-widest">LOADING USERS...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-orbitron">
                    NO USERS FOUND
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-darker border border-cardHover flex items-center justify-center shadow-inner">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.full_name || 'Unnamed User'}</div>
                          <div className="text-[10px] text-gray-500 font-mono">{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border flex w-fit items-center gap-1.5 ${
                        user.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        user.role === 'booster' ? 'bg-neon/10 text-neon border-neon/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                        {user.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs font-orbitron">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <select 
                        className="bg-darker border border-cardHover rounded text-[10px] p-1 text-white focus:outline-none focus:border-neon"
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="booster">Booster</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button 
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this user?')) {
                            // Handle delete
                            console.log('Delete user:', user.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
