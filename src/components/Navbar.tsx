"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Menu, X, User, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);

    // Initial check for session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
    });

    const fetchProfile = async (userId: string) => {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', userId)
        .maybeSingle();
      setProfile(profileData);
    };

    return () => {
      window.removeEventListener("scroll", onScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push('/');
  };

  const links = [
    { href: "#hero", label: "Home" },
    { href: "#ranks", label: "Ranks" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#boosters", label: "Boosters" },
    { href: "#faq", label: "FAQ" },
  ];

  const isAdmin = profile?.role === 'admin';

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-dark/80 backdrop-blur-xl border-b border-neon/10 shadow-[0_4px_30px_rgba(0,229,255,0.05)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Zap className="w-7 h-7 text-neon group-hover:animate-pulse" />
          <span className="font-orbitron text-xl font-black tracking-widest text-white">
            BOOST<span className="text-neon glow-neon">TRACK</span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-gray-400 hover:text-neon font-medium tracking-wide transition-colors duration-300 relative group"
            >
              {l.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-neon group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* CTA / User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-full border border-neon/40 hover:border-neon hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all"
              >
                <User className="w-5 h-5 text-neon" />
                <span className="text-white text-sm font-medium">
                  {profile?.full_name || user.email?.split('@')[0] || 'User'}
                </span>
                {isAdmin && (
                  <span className="text-xs bg-neon/20 text-neon px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-cardHover rounded-xl shadow-xl overflow-hidden">
                  {isAdmin && (
                    <>
                      <Link href="/admin">
                        <div className="px-4 py-3 hover:bg-cardHover flex items-center gap-3 text-white transition-colors cursor-pointer">
                          <LayoutDashboard className="w-4 h-4 text-neon" />
                          Admin Dashboard
                        </div>
                      </Link>
                      <div className="border-t border-cardHover"></div>
                    </>
                  )}
                  <Link href="/dashboard">
                    <div className="px-4 py-3 hover:bg-cardHover flex items-center gap-3 text-white transition-colors cursor-pointer">
                      <User className="w-4 h-4 text-accentBlue" />
                      My Dashboard
                    </div>
                  </Link>
                  <div className="border-t border-cardHover"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-cardHover flex items-center gap-3 text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="btn-neon px-6 py-2.5 rounded-lg text-sm font-bold uppercase cursor-pointer">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-dark/95 backdrop-blur-xl border-t border-neon/10 px-6 py-6 space-y-4"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block text-gray-300 hover:text-neon font-medium transition-colors"
            >
              {l.label}
            </a>
          ))}
          {user ? (
            <>
              {isAdmin && (
                <Link href="/admin" onClick={() => setMenuOpen(false)}>
                  <div className="flex items-center gap-3 text-neon font-medium py-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Dashboard
                  </div>
                </Link>
              )}
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                <div className="flex items-center gap-3 text-white font-medium py-2">
                  <User className="w-4 h-4" />
                  My Dashboard
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-red-400 font-medium py-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <Link href="/login">
              <button className="btn-solid-neon w-full py-3 rounded-lg text-sm uppercase mt-2 cursor-pointer">
                Login
              </button>
            </Link>
          )}
        </motion.div>
      )}
    </motion.header>
  );
}
