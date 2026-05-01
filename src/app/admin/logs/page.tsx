"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Clock, User, Hash } from "lucide-react";
import Link from "next/link";

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/logs/list');
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-orbitron text-white uppercase tracking-wide">
            SYSTEM <span className="text-neon">LOGS</span>
          </h1>
          <p className="text-gray-400 mt-1">Real-time activity tracking across the platform.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin">
            <Button variant="outline" className="border-cardHover text-gray-300">Back to Dashboard</Button>
          </Link>
          <Button variant="outline" className="border-cardHover text-gray-300" onClick={fetchLogs}>
            Refresh
          </Button>
        </div>
      </div>

      <Card className="bg-card/50 border-cardHover">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-darker border-b border-cardHover">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Order Ref</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center gap-2 text-neon">
                      <span className="w-6 h-6 rounded-full border-2 border-neon border-t-transparent animate-spin"></span>
                      <span className="font-orbitron text-xs tracking-widest">FETCHING LOGS...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="bg-card border-b border-cardHover/50 hover:bg-darker/50 transition-colors">
                    <td className="px-6 py-4 text-gray-400 flex items-center gap-2">
                      <Clock className="w-3 h-3 text-accentBlue" />
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      <span className="px-2 py-1 bg-white/5 rounded border border-white/10 text-[11px] uppercase tracking-wider">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-gray-500" />
                        {log.profiles?.full_name || log.user_id?.substring(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {log.order_id ? (
                        <div className="flex items-center gap-2 text-neon text-[11px] font-mono">
                          <Hash className="w-3 h-3" />
                          {log.order_id.substring(0, 8).toUpperCase()}
                        </div>
                      ) : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
