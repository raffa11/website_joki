import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-dark flex flex-col">
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

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8 text-gray-300 prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold font-poppins text-white">Terms of Service</h1>
          <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using BoostTrack, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">2. Service Description</h2>
            <p>
              BoostTrack provides a management platform for independent game boosting contractors and clients. We act as a software intermediary to facilitate secure transactions, progress tracking, and communication.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">3. User Obligations</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be 18 years or older to use this service.</li>
              <li>You agree not to share your account credentials.</li>
              <li>You agree that game boosting may violate the Terms of Service of third-party game publishers, and you accept all risks associated with your game accounts.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">4. Payments and Refunds</h2>
            <p>
              All payments are processed securely via Stripe. Refunds are only issued if a booster fails to start the order within 48 hours or cannot complete the requested rank within the estimated timeframe. Once an order is completed, no refunds will be issued.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-800 py-8 bg-dark mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} BoostTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
