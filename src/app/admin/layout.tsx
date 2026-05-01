import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - BoostTrack",
  description: "Admin order management",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-dark text-white selection:bg-neon/30">
      {children}
    </div>
  );
}
