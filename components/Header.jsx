// components/Header.jsx
// Navigation header matching footer style
// Blue background with white text
// ============================================
"use client";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo - Gold/Accent color for contrast */}
          <Link href="/" className="text-2xl font-bold text-accent hover:text-white transition-colors flex items-center gap-2">
            <span className="text-3xl">🕌</span>
            <span>Al-Rahma</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 font-medium">
            <Link href="/gallery" className="text-white hover:text-accent transition-colors">
              Gallery
            </Link>
            <Link href="/pelare" className="text-white hover:text-accent transition-colors">
              Islamiska pelare
            </Link>
            <Link href="/donations" className="text-white hover:text-accent transition-colors">
              Donationer
            </Link>
            <Link href="/contact" className="text-white hover:text-accent transition-colors">
              Kontakt
            </Link>

            {/* Dashboard - Special styling */}
            <Link href="/dashboard" className="bg-accent text-primary px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
              🔐 Dashboard
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-3xl focus:outline-none text-white hover:text-accent transition-colors" aria-label="Toggle menu">
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {open && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4">
            <div className="flex flex-col space-y-3">
              <Link href="/gallery" className="text-white hover:text-accent transition-colors py-2 flex items-center gap-2" onClick={() => setOpen(false)}>
                <span>Gallery</span>
              </Link>
              <Link href="/pelare" className="text-white hover:text-accent transition-colors py-2 flex items-center gap-2" onClick={() => setOpen(false)}>
                <span>Islamiska pelare</span>
              </Link>
              <Link href="/donations" className="text-white hover:text-accent transition-colors py-2 flex items-center gap-2" onClick={() => setOpen(false)}>
                <span>Donationer</span>
              </Link>
              <Link href="/contact" className="text-white hover:text-accent transition-colors py-2 flex items-center gap-2" onClick={() => setOpen(false)}>
                <span>Kontakt</span>
              </Link>

              {/* Dashboard - Mobile */}
              <Link href="/dashboard" className="bg-accent text-primary px-4 py-3 rounded-lg font-semibold hover:bg-white transition-colors text-center flex items-center justify-center gap-2" onClick={() => setOpen(false)}>
                <span>🔐</span>
                <span>Dashboard</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
