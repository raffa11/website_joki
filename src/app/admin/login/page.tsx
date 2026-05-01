"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon/5 rounded-full blur-[100px] pointer-events-none" />
      
      <Link href="/" className="flex items-center gap-2 mb-8 relative z-10 hover:scale-105 transition-transform">
        <Shield className="w-8 h-8 text-neon" />
        <span className="text-3xl font-bold font-poppins text-white">
          Boost<span className="text-neon">Track</span>
        </span>
      </Link>

      <Card className="w-full max-w-md border-cardHover shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10 bg-card/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-1">
          <div className="w-16 h-16 bg-neon/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Shield className="w-8 h-8 text-neon" />
          </div>
          <CardTitle className="text-2xl font-poppins text-white">Admin Login</CardTitle>
          <p className="text-sm text-gray-400">Enter admin credentials to access dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-md text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input 
                  type="email" 
                  placeholder="admin@boosttrack.com" 
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-neon hover:bg-neon/80 text-dark font-bold"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In as Admin"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-gray-400 hover:text-neon transition-colors">
              ← Back to User Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
