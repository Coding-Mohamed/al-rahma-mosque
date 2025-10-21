// app/pelare/page.jsx
// Islamic Pillars - Redesigned with your colors
// Responsive, image-focused design
// Now supports hiding CTA when embedded in homepage
// ============================================
"use client";
import { useState, useEffect } from "react";

export default function PelarePage({ showCTA = true }) {
  const [selectedPillar, setSelectedPillar] = useState(null);

  // Scroll to detailed view when a pillar is selected
  useEffect(() => {
    if (selectedPillar) {
      const detailSection = document.getElementById("pillar-detail");
      if (detailSection) {
        setTimeout(() => {
          detailSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
  }, [selectedPillar]);

  // Five Pillars with all information
  const pillars = [
    {
      id: 1,
      name: "Shahada",
      nameSwedish: "Trosbekännelsen",

      image: "https://images.unsplash.com/photo-1677900519718-cde0eb2a825c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGlzbGFtJTIwcHJheWVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
      arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ ٱللَّٰهِ",
      translation: "Jag vittnar om att det inte finns någon gud utom Allah, och jag vittnar om att Muhammed är Allahs budbärare",
      description: "Trosbekännelsen är den första och viktigaste pelaren i Islam. Den består av två delar: bekräftelse av Allahs enhet och erkännande av Muhammed som Allahs sista profet.",
      details: ["Förstå innebörden djupt, inte bara memorera orden", "Lev enligt trosbekännelsens principer dagligen", "Reflektera över Allahs enhet i alla livets aspekter", "Följ profeten Muhameds (frid över honom) exempel"],
    },
    {
      id: 2,
      name: "Salah",
      nameSwedish: "Bönen",

      image: "https://images.unsplash.com/photo-1637518026117-9d1ac5e73f07?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bXVzbGltJTIwcHJheWluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900",
      arabic: "وَأَقِيمُوا الصَّلَاةَ",
      translation: "Och upprätthåll bönen",
      description: "Bönen är den direkta förbindelsen mellan muslimen och Allah. Den utförs fem gånger dagligen vid bestämda tider.",
      prayerTimes: [
        { name: "Fajr", time: "Före soluppgång" },
        { name: "Dhuhr", time: "Mitt på dagen" },
        { name: "Asr", time: "Eftermiddag" },
        { name: "Maghrib", time: "Solnedgång" },
        { name: "Isha", time: "Kvällsbön" },
      ],
      details: ["Lär dig bönetiderna och håll dem regelbundet", "Förbered dig med ritual tvättning (Wudu)", "Vänd dig mot Kaaba i Mecka (Qibla)", "Fokusera på närvarande och uppmärksamhet"],
    },
    {
      id: 3,
      name: "Zakat",
      nameSwedish: "Allmosa",

      image: "https://images.unsplash.com/photo-1512358958014-b651a7ee1773?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2l2ZSUyMG1vbmV5fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
      arabic: "وَآتُوا الزَّكَاةَ",
      translation: "Och ge Zakat",
      description: "Zakat är en obligatorisk välgörenhetsavgift - 2,5% av sparade medel som har funnits i minst ett år.",
      details: ["Beräkna din Zakat årligen (2,5% av sparpengar)", "Ge till berättigade: fattiga, skuldsatta, konvertiter", "Ge lokallt när möjligt för att hjälpa ditt samhälle", "Håll reda på dina donationer för transparens"],
    },
    {
      id: 4,
      name: "Sawm",
      nameSwedish: "Fastan",

      image: "https://images.unsplash.com/photo-1648288725215-ece6cdaa32b2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aXNsYW0lMjBmb29kfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
      arabic: "وَصُومُوا رَمَضَانَ",
      translation: "Och fasta under Ramadan",
      description: "Fastan under Ramadan - avstå från mat, dryck från gryning till solnedgång under den nionde månaden.",
      details: ["Ät Suhur (morgonmål) före gryning", "Bryt fastan vid solnedgång med Iftar", "Fokusera på andlig utveckling", "Läs extra Quran och utför mer ibadah"],
    },
    {
      id: 5,
      name: "Hajj",
      nameSwedish: "Pilgrimsfärden",

      image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800",
      arabic: "وَلِلَّٰهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ",
      translation: "För Allah är det en plikt att göra pilgrimsfärd till huset",
      description: "Pilgrimsfärden till Mecka som varje muslim med förmåga ska utföra minst en gång i livet.",
      rituals: ["Ihram - Ritual renhet och speciell klädsel", "Tawaf - Sju varv runt Kaaba", "Sa'i - Gång mellan Safa och Marwah", "Wuquf - Stående på Arafat", "Stening av djävulen vid Mina"],
      details: ["Spara ekonomiskt och planera i förväg", "Lär dig ritualerna innan avresan", "Förbered dig fysiskt och andligt", "Utför Hajj med rätt intention (Niyyah)"],
    },
  ];

  return (
    <div className={`${showCTA ? "min-h-screen bg-lighter" : ""}`}>
      {/* Hero Header - Only show on standalone page */}
      {showCTA && (
        <div className="bg-gradient-to-br from-primary to-accent text-white py-16 px-4 rounded-2xl">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Islams Fem Pelare</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">De grundläggande principerna som utgör grunden för muslimsk tro och praktik</p>
          </div>
        </div>
      )}

      <div className={`${showCTA ? "max-w-7xl mx-auto px-4 py-12" : ""}`}>
        {/* Title for embedded version */}
        {!showCTA && (
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-4">Islams Fem Pelare</h2>
            <p className="text-center text-gray-600 max-w-3xl mx-auto">De grundläggande principerna som utgör grunden för muslimsk tro och praktik</p>
          </div>
        )}

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {pillars.map((pillar) => (
            <div key={pillar.id} onClick={() => setSelectedPillar(selectedPillar === pillar.id ? null : pillar.id)} className={`cursor-pointer transform transition-all duration-300 hover:scale-105 ${selectedPillar === pillar.id ? "scale-105" : ""}`}>
              {/* Pillar Card */}
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl group">
                {/* Background Image */}
                <img src={pillar.image} alt={pillar.nameSwedish} className="absolute inset-0 w-full h-full object-cover" />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">{pillar.icon}</div>
                  <h3 className="text-2xl font-bold mb-1">{pillar.name}</h3>
                  <p className="text-lg opacity-90">{pillar.nameSwedish}</p>

                  {/* Click indicator */}
                  <div className="mt-4 text-sm opacity-75">{selectedPillar === pillar.id ? "▲ Stäng" : "▼ Läs mer"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed View */}
        {selectedPillar && (
          <div id="pillar-detail" className="mb-12 animate-fade-in">
            {pillars
              .filter((p) => p.id === selectedPillar)
              .map((pillar) => (
                <div key={pillar.id} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                  {/* Close button for mobile */}
                  <div className="lg:hidden bg-primary text-white p-4 text-center">
                    <button onClick={() => setSelectedPillar(null)} className="text-white hover:text-gray-200 font-semibold">
                      ✕ Stäng
                    </button>
                  </div>
                  {/* Header with Image Background */}
                  <div className="relative h-64 md:h-80">
                    <img src={pillar.image} alt={pillar.nameSwedish} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>

                    <div className="absolute inset-0 flex items-end p-8 text-white">
                      <div>
                        <div className="text-6xl mb-4">{pillar.icon}</div>
                        <h2 className="text-4xl font-bold mb-2">
                          {pillar.name} - {pillar.nameSwedish}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    {/* Arabic Text */}
                    <div className="bg-lighter rounded-xl p-6 mb-6 border-l-4 border-accent">
                      <p className="text-2xl text-center mb-3 text-primary" style={{ direction: "rtl" }}>
                        {pillar.arabic}
                      </p>
                      <p className="text-center text-gray-700 italic">"{pillar.translation}"</p>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-primary mb-4">📖 Beskrivning</h3>
                      <p className="text-lg text-gray-700 leading-relaxed">{pillar.description}</p>
                    </div>

                    {/* Prayer Times (for Salah) */}
                    {pillar.prayerTimes && (
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold text-primary mb-4">🕐 Bönetider</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {pillar.prayerTimes.map((time) => (
                            <div key={time.name} className="bg-lighter rounded-lg p-4 text-center border-2 border-primary">
                              <p className="font-bold text-primary text-lg">{time.name}</p>
                              <p className="text-sm text-gray-600">{time.time}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rituals (for Hajj) */}
                    {pillar.rituals && (
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold text-primary mb-4">🕋 Viktiga Ritualer</h3>
                        <div className="space-y-3">
                          {pillar.rituals.map((ritual, index) => (
                            <div key={index} className="bg-lighter p-4 rounded-lg border-l-4 border-accent">
                              <p className="text-gray-700">{ritual}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Practical Guidance */}
                    <div>
                      <h3 className="text-2xl font-bold text-primary mb-4">💡 Praktisk Vägledning</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pillar.details.map((detail, index) => (
                          <div key={index} className="flex items-start gap-3 bg-lighter p-4 rounded-lg">
                            <span className="text-accent text-2xl">✓</span>
                            <p className="text-gray-700">{detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Call to Action - Only show on standalone page */}
        {showCTA && (
          <div className="bg-gradient-to-br from-primary to-accent text-white rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Vill du lära dig mer?</h2>
            <p className="text-lg mb-6 opacity-90">Besök Al-Rahma moské för djupare studier och vägledning</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Kontakta oss
              </a>
              <a href="/donations" className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition">
                Stöd moskén
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
