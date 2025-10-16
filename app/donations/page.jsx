// app/donations/page.jsx
// Donations - Clean, simple with QR code
// ============================================
"use client";
import { useState } from "react";
import Image from "next/image";

export default function DonationsPage() {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");

  // ========== CUSTOMIZE THESE VALUES ==========
  const SWISH_NUMBER = "1231553262"; // ← Change to your Swish number
  const BANKGIRO = "5717-3809"; // ← Change to your Bankgiro
  const MOSQUE_NAME = "Al-Rahma Moské";

  // Quick amount buttons
  const quickAmounts = [100, 250, 500, 1000, 2500];
  // ==========================================

  const getCurrentAmount = () => customAmount || selectedAmount || 0;

  const handleDonate = () => {
    const amount = getCurrentAmount();
    if (!amount) {
      alert("Välj eller ange ett belopp först");
      return;
    }

    // Swish deep link
    const message = `${MOSQUE_NAME} - Donation`;
    const swishUrl = `swish://payment?phone=${SWISH_NUMBER}&amount=${amount}&message=${encodeURIComponent(message)}`;

    window.location.href = swishUrl;

    // Fallback instructions
    setTimeout(() => {
      alert(`Om Swish inte öppnades:\n\n` + `Swish till: ${SWISH_NUMBER}\n` + `Belopp: ${amount} kr\n` + `Meddelande: ${message}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-lighter">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-accent text-white py-16 px-4 rounded-2xl shadow-xl mx-4 mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Donationer</h1>
          <p className="text-lg md:text-xl opacity-90">Stöd {MOSQUE_NAME} och vår gemenskap</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Donation Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Välj belopp</h2>

            {/* Quick Amounts */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className={`p-4 rounded-lg font-bold text-lg transition ${selectedAmount === amount ? "bg-primary text-white shadow-lg" : "bg-lighter text-primary hover:bg-gray-200"}`}
                >
                  {amount} kr
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Eller ange eget belopp:</label>
              <input
                type="number"
                min="10"
                placeholder="Ange belopp i kr"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-lg"
              />
            </div>

            {/* Selected Amount Display */}
            {getCurrentAmount() > 0 && (
              <div className="bg-lighter rounded-lg p-4 mb-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Valt belopp:</p>
                <p className="text-4xl font-bold text-primary">{getCurrentAmount()} kr</p>
              </div>
            )}

            {/* Donate Button */}
            <button onClick={handleDonate} disabled={!getCurrentAmount()} className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
              💳 Donera med Swish
            </button>

            {/* Alternative: Bankgiro */}
            <div className="mt-6 p-4 bg-lighter rounded-lg border-2 border-primary">
              <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                <span>🏦</span>
                <span>Bankgiro</span>
              </h3>
              <p className="text-sm text-gray-700">
                <strong>Bankgiro:</strong> {BANKGIRO}
                <br />
                <strong>Mottagare:</strong> {MOSQUE_NAME}
              </p>
            </div>
          </div>

          {/* Right: QR Code & Info */}
          <div className="space-y-6">
            {/* QR Code - Using your image from public folder */}
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <h3 className="text-xl font-bold text-primary mb-4">📱 Scanna med Swish</h3>

              {/* Your QR Code Image */}
              <div className="flex justify-center mb-4">
                <div className="relative w-64 h-64 bg-lighter rounded-xl p-4 border-4 border-primary">
                  <Image src="/QR-code.png" alt="Swish QR Code" fill className="object-contain p-2" priority />
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2">Scanna QR-koden med Swish-appen</p>
              <p className="text-xs text-gray-500">Swish: {SWISH_NUMBER}</p>
            </div>

            {/* Why Donate */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-primary mb-4">💚 Varför donera?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Stöd dagliga böner och fredagsbön</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Finansiera koranskola för barn</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Hjälp behövande i gemenskapen</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Underhåll moskéns lokaler</span>
                </li>
              </ul>
            </div>

            {/* Donation Types */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-primary mb-4">📋 Typer av donationer</h3>
              <div className="space-y-3">
                <div className="p-3 bg-lighter rounded-lg border-l-4 border-primary">
                  <h4 className="font-bold text-primary mb-1">💰 Zakat (2.5%)</h4>
                  <p className="text-sm text-gray-600">Obligatorisk välgörenhet för muslimer</p>
                </div>
                <div className="p-3 bg-lighter rounded-lg border-l-4 border-accent">
                  <h4 className="font-bold text-primary mb-1">❤️ Sadaqa</h4>
                  <p className="text-sm text-gray-600">Frivillig välgörenhet för Allahs skull</p>
                </div>
                <div className="p-3 bg-lighter rounded-lg border-l-4 border-primary">
                  <h4 className="font-bold text-primary mb-1">🕌 Allmän donation</h4>
                  <p className="text-sm text-gray-600">Stöd moskéns allmänna verksamhet</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-primary mb-4">❓ Frågor?</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span>📧</span>
                  <span>info@alrahmamoske.se</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <span>+46 737739772</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>💵</span>
                  <span>Kontant: Vid moskén efter bönen</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-600 bg-white p-6 rounded-lg shadow-md">
          <p className="mb-2">
            <strong>{MOSQUE_NAME}</strong> är en registrerad religiös organisation.
          </p>
          <p>Alla donationer används transparent för moskéns verksamhet och välgörenhet.</p>
        </div>
      </div>
    </div>
  );
}
