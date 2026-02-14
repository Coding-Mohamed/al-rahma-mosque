// components/home/CalendarSection.jsx
// Islamic & Gregorian Calendar Display
// Shows current dates and important Islamic dates for the year
// ============================================
"use client";
import { useState, useEffect } from "react";

export default function CalendarSection() {
  const [currentDate, setCurrentDate] = useState({
    gregorian: "",
    islamic: "",
    hijriMonth: "",
    hijriYear: "",
    gregorianMonth: "",
    gregorianYear: "",
  });

  useEffect(() => {
    fetchIslamicDate();
  }, []);

  const fetchIslamicDate = async () => {
    try {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      // Using Al-Adhan API for Islamic date conversion
      const response = await fetch(`https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`);
      const data = await response.json();

      if (data.code === 200) {
        const hijri = data.data.hijri;
        const gregorian = data.data.gregorian;

        // Debug: Log the API response to understand exact month names
        console.log("Hijri month from API:", hijri.month.en);
        console.log("Full hijri data:", hijri);

        setCurrentDate({
          gregorian: `${gregorian.day} ${gregorian.month.en} ${gregorian.year}`,
          islamic: `${hijri.day} ${hijri.month.ar} ${hijri.year}`,
          hijriMonth: hijri.month.en,
          hijriYear: hijri.year,
          gregorianMonth: gregorian.month.en,
          gregorianYear: gregorian.year,
        });
      }
    } catch (error) {
      console.error("Error fetching Islamic date:", error);
      // Fallback to just Gregorian date
      const today = new Date();
      const options = { day: "numeric", month: "long", year: "numeric" };
      setCurrentDate({
        gregorian: today.toLocaleDateString("sv-SE", options),
        islamic: "Laddar...",
        hijriMonth: "",
        hijriYear: "",
        gregorianMonth: today.toLocaleDateString("sv-SE", { month: "long" }),
        gregorianYear: today.getFullYear().toString(),
      });
    }
  };

  // Islamic months in order - using same names as API for proper matching
  const islamicMonths = [
    { name: "Muharram", number: 1 },
    { name: "Safar", number: 2 },
    { name: "Rabī' al-awwal", number: 3 },
    { name: "Rabī' al-thānī", number: 4 },
    { name: "Jumādá al-ūlá", number: 5 },
    { name: "Jumādá al-ākhirah", number: 6 },
    { name: "Rajab", number: 7 },
    { name: "Sha'bān", number: 8 },
    { name: "Ramaḍān", number: 9 },
    { name: "Shawwāl", number: 10 },
    { name: "Dhū al-Qa'dah", number: 11 },
    { name: "Dhū al-Ḥijjah", number: 12 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-3">Islamisk & Gregoriansk Kalender</h2>
          <p className="text-gray-600">Lär dig islamiska Kalender</p>
        </div>

        {/* Current Date Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Gregorian Date */}
          <div className="bg-gradient-to-br from-primary to-accent text-white rounded-lg p-6 text-center">
            <div className="text-sm opacity-90 mb-2">Gregoriansk Kalender</div>
            <div className="text-4xl font-bold mb-2">📆</div>
            <div className="text-2xl font-bold mb-1">{currentDate.gregorian}</div>
            <div className="text-sm opacity-90">
              {currentDate.gregorianMonth} {currentDate.gregorianYear}
            </div>
          </div>

          {/* Islamic Date */}
          <div className="bg-gradient-to-br from-accent to-primary text-white rounded-lg p-6 text-center">
            <div className="text-sm opacity-90 mb-2">Islamisk Kalender (Hijri)</div>
            <div className="text-4xl font-bold mb-2">🌙</div>
            <div className="text-2xl font-bold mb-1" style={{ direction: "rtl" }}>
              {currentDate.islamic}
            </div>
            <div className="text-sm opacity-90">
              {currentDate.hijriMonth} {currentDate.hijriYear} H
            </div>
          </div>
        </div>

        {/* Islamic Months Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-primary text-center mb-6">Islamiska Månader</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {islamicMonths.map((month) => {
              // More flexible matching to handle different transliterations
              const isCurrentMonth = currentDate.hijriMonth === month.name || (month.number === 5 && (currentDate.hijriMonth === "Jumada al-Awwal" || currentDate.hijriMonth === "Jumādá al-ūlá")) || (month.number === 6 && (currentDate.hijriMonth === "Jumada al-Thani" || currentDate.hijriMonth === "Jumādá al-ākhirah"));

              return (
                <div key={month.number} className={`p-4 rounded-lg text-center transition-all hover:scale-105 ${isCurrentMonth ? "bg-gradient-to-br from-primary to-accent text-white shadow-lg" : "bg-lighter hover:bg-gray-200"}`}>
                  <div className={`text-sm font-semibold mb-1 ${isCurrentMonth ? "text-white" : "text-primary"}`}>{month.name}</div>
                  <div className={`text-xs ${isCurrentMonth ? "text-white opacity-90" : "text-gray-600"}`}>Månad {month.number}</div>
                  {/* {isCurrentMonth && <div className="mt-2 text-xs bg-white/20 px-2 py-1 rounded">Aktuell</div>} */}
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-8 bg-lighter rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-primary">📌 Observera:</span> Islamiska datum kan variera ±1 dag beroende på månens synlighet. Följ moskéns officiella tillkännagivanden för exakta datum.
          </p>
        </div>
      </div>
    </div>
  );
}
