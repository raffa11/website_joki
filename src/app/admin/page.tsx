"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, ShoppingCart, Users, Download } from "lucide-react";

export default function AdminDashboard() {
  const handleExportData = () => {
    window.location.href = '/admin/orders';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold font-orbitron text-white uppercase tracking-wide">
            ADMIN <span className="text-neon">DASHBOARD</span>
          </h1>
          <p className="text-gray-400 mt-1">Welcome to BoostTrack Admin Panel</p>
        </div>
        <Button 
          variant="neon" 
          onClick={handleExportData}
          className="gap-2 font-bold font-orbitron tracking-widest"
        >
          <Download className="w-4 h-4" /> EXPORT DATA
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/order-board">
          <Card className="bg-card/50 border-cardHover hover:border-neon/50 transition-all cursor-pointer group h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <ShoppingCart className="w-6 h-6 text-neon" />
                Order Board
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">Manage and track all customer orders with drag-and-drop</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/orders">
          <Card className="bg-card/50 border-cardHover hover:border-neon/50 transition-all cursor-pointer group h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <BarChart3 className="w-6 h-6 text-accentBlue" />
                Orders List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">View detailed order list with filters and status management</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="bg-card/50 border-cardHover hover:border-neon/50 transition-all cursor-pointer group h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Users className="w-6 h-6 text-green-400" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">Manage customer accounts and assign booster roles</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
