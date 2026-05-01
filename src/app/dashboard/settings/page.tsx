"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Gamepad2, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-poppins text-white">Account Settings</h1>
        <p className="text-gray-400 mt-1">Manage your profile, connected accounts, and preferences.</p>
      </div>

      <div className="grid md:grid-cols-[1fr_250px] gap-8">
        <div className="space-y-6">
          {/* Profile Section */}
          <Card className="border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="w-5 h-5 text-neon" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-darker border-2 border-gray-700 flex items-center justify-center overflow-hidden">
                  <User className="w-10 h-10 text-gray-500" />
                </div>
                <Button variant="outline" size="sm">Change Avatar</Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Display Name</label>
                  <Input defaultValue="PlayerOne" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input defaultValue="player@example.com" className="pl-10" disabled />
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="neon">Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Game Accounts */}
          <Card className="border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-neon" />
                Connected Game Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-darker rounded-lg border border-gray-800">
                <div>
                  <p className="font-medium text-white">Mobile Legends</p>
                  <p className="text-xs text-gray-400">ID: 12345678 (1234)</p>
                </div>
                <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300 border-red-500/20 hover:bg-red-500/10">Disconnect</Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-darker rounded-lg border border-dashed border-gray-700">
                <div>
                  <p className="font-medium text-gray-300">Valorant</p>
                  <p className="text-xs text-gray-500">Not connected</p>
                </div>
                <Button variant="outline" size="sm">Connect Riot ID</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Preferences */}
        <div className="space-y-6">
          <Card className="border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-neon" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-700 bg-darker text-neon focus:ring-neon" defaultChecked />
                <span className="text-sm text-gray-300">Order Updates</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-700 bg-darker text-neon focus:ring-neon" defaultChecked />
                <span className="text-sm text-gray-300">Marketing Emails</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-700 bg-darker text-neon focus:ring-neon" />
                <span className="text-sm text-gray-300">Booster Chat Messages</span>
              </label>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
