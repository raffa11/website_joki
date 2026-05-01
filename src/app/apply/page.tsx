"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Upload, CheckCircle } from "lucide-react";

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to send application would go here
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Navbar */}
      <header className="border-b border-gray-800 bg-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-neon" />
            <span className="text-xl font-bold font-poppins text-white">Boost<span className="text-neon">Track</span></span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">Back to Home</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-poppins text-white">Join Our Booster Team</h1>
            <p className="text-gray-400 text-lg">Turn your gaming skills into a reliable income stream. We are always looking for top-tier players to join our trusted platform.</p>
          </div>

          {submitted ? (
            <Card className="border-green-500/30 bg-green-500/5 py-12">
              <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <h2 className="text-2xl font-bold text-white">Application Received!</h2>
                <p className="text-gray-400 max-w-md">Thank you for applying. Our admin team will review your statistics and contact you via email within 48 hours for the next steps.</p>
                <Link href="/">
                  <Button variant="neon" className="mt-4">Return Home</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-gray-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon to-blue-600"></div>
              <CardHeader>
                <CardTitle className="text-2xl">Application Form</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Full Name</label>
                      <Input type="text" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Email Address</label>
                      <Input type="email" placeholder="john@example.com" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Discord Username</label>
                    <Input type="text" placeholder="johndoe#1234" required />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Primary Game</label>
                      <select className="w-full bg-darker border border-gray-800 rounded-md p-3 text-white focus:outline-none focus:border-neon">
                        <option>Mobile Legends</option>
                        <option>Valorant</option>
                        <option>League of Legends</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Current Peak Rank</label>
                      <Input type="text" placeholder="e.g. Mythic Glory 1000 Stars" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Why do you want to be a booster?</label>
                    <textarea 
                      className="w-full h-32 bg-darker border border-gray-800 rounded-md p-3 text-white focus:outline-none focus:border-neon resize-none"
                      placeholder="Tell us about your experience..."
                      required
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Upload Screenshot of Peak Rank</label>
                    <div className="border-2 border-dashed border-gray-800 rounded-lg p-8 text-center hover:border-neon/50 transition-colors cursor-pointer bg-darker/50">
                      <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </div>

                  <Button type="submit" variant="neon" size="lg" className="w-full">
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 bg-dark">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} BoostTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
