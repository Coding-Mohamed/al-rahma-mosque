// app/page.js
// Home page with Hero section, Prayer times iframe, and Services grid
// ============================================
"use client";
import { useState, useEffect } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import PelarePage from "@/app/pelare/page";
import CalenderSection from "@/components/CalendarSection";
import Services from "@/components/services";

export default function HomePage() {
  return (
    <section className="space-y-20">
      {/* HeroCarousel fetches slides from Firestore and auto-rotates every 10 seconds */}

      <div className=" py-4 ">
        <HeroCarousel />
      </div>

      {/* Prayer Times Section - Embedded iframe */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-primary">
        <h2 className="text-3xl font-bold text-primary text-center mb-6">Bönetider</h2>
        <div className="w-full" style={{ height: "500px" }}>
          {/* Embedded prayer times from my-masjid.com */}
          {/* TODO: Later replace with direct API integration for better customization */}
          <iframe src="https://time.my-masjid.com/timingscreen/3b4986ae-db53-4d4c-9362-ae73ecc65d86" className="w-full h-full rounded-lg border-2 border-primary" title="Prayer Times" allowFullScreen />
        </div>
        <p className="text-sm text-gray-600 text-center mt-4">Live bönetider uppdateras automatiskt</p>
      </div>

      {/* Services Section - "Vad Vi Erbjuder" */}
      <div className="bg-lighter rounded-lg">
        <Services />
      </div>

      {/* Call to Action Section - Only one CTA for entire homepage */}
      <div className="bg-primary text-white rounded-lg shadow-lg p-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Bli en del av vår gemenskap</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">Besök oss för bön, lärande och gemenskap. Alla är välkomna.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center ">
          <a href="/contact" className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
            Kontakta Oss
          </a>
          <a href="/donations" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-accent hover:text-white transition-colors">
            Donera Nu
          </a>
        </div>
      </div>

      {/* Pelare Section - Embedded without CTA */}
      <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-primary">
        <PelarePage showCTA={false} />
      </div>

      {/* About Section - Welcome message and mosque info */}
      <div className=" rounded-lg border-t-4 border-primary ">
        <CalenderSection />
      </div>
    </section>
  );
}
