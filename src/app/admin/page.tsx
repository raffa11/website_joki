"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, ShoppingCart, Users, Download, Home, LayoutDashboard } from "lucide-react";

export default function AdminDashboard() {
  const handleExportData = () => {
    window.location.href = '/admin/orders';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header with navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-orbitron text-white uppercase tracking-wide">
            ADMIN <span className="text-neon">DASHBOARD</span>
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Welcome to BoostTrack Admin Panel</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button 
              variant="outline" 
              className="gap-2 font-orbitron text-xs tracking-widest border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <Home className="w-4 h-4" /> HOME
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button 
              variant="outline" 
              className="gap-2 font-orbitron text-xs tracking-widest border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <LayoutDashboard className="w-4 h-4" /> MY DASHBOARD
            </Button>
          </Link>
          <Button 
            variant="neon" 
            onClick={handleExportData}
            className="gap-2 font-bold font-orbitron tracking-widest text-xs"
          >
            <Download className="w-4 h-4" /> EXPORT
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Link href="/admin/order-board" className="block">
          <Card className="bg-card/50 border-cardHover hover:border-neon/50 transition-all cursor-pointer group h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-lg">
                <ShoppingCart className="w-5 h-5 text-neon" />
                Order Board
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">Manage and track all customer orders with drag-and-drop</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/orders" className="block">
          <Card className="bg-card/50 border-cardHover hover:border-neon/50 transition-all cursor-pointer group h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-lg">
                <BarChart3 className="w-5 h-5 text-accentBlue" />
                Orders List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">View detailed order list with filters and status management</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users" className="block">
          <Card className="bg-card/50 border-cardHover hover:border-neon/50 transition-all cursor-pointer group h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-lg">
                <Users className="w-5 h-5 text-green-400" />
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
