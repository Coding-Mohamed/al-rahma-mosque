// app/donations/monthly/page.jsx
"use client";
import { useState } from "react";
import Link from "next/link";

export default function MonthlyDonationsPage() {
  const [amount, setAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const predefinedAmounts = [50, 100, 250, 500, 1000];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const finalAmount = customAmount || amount;

      if (finalAmount < 10) {
        setError("Minsta belopp är 10 kr");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          email: email.trim(),
          name: name.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Något gick fel");
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Kunde inte starta betalningen");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Något gick fel. Försök igen.");
      setLoading(false);
    }
  };

  const getCurrentAmount = () => customAmount || amount;

  return (
    <div className="min-h-screen bg-lighter py-12">
      {/* Test Mode Banner - Only show in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-yellow-100 border-2 border-yellow-400 text-yellow-800 px-4 py-3 text-center mb-8">
          <p className="font-bold">🧪 TEST MODE</p>
          <p className="text-sm">Använd kortnummer: 4242 4242 4242 4242</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Månatlig Donation</h1>
          <p className="text-lg text-gray-600">Stöd Al-Rahma Moské varje månad med en fast donation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Välj belopp</h2>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubscribe} className="space-y-6">
              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Månadsbelopp:</label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setAmount(amt);
                        setCustomAmount("");
                      }}
                      className={`p-3 rounded-lg font-bold transition ${amount === amt && !customAmount ? "bg-primary text-white" : "bg-lighter text-primary hover:bg-gray-200"}`}
                    >
                      {amt} kr
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <input
                  type="number"
                  min="10"
                  placeholder="Eller eget belopp (min 10 kr)"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setAmount(0);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                />
              </div>

              {/* Selected Amount Display */}
              {getCurrentAmount() > 0 && (
                <div className="bg-lighter rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Du donerar varje månad:</p>
                  <p className="text-4xl font-bold text-primary">{getCurrentAmount()} kr</p>
                  <p className="text-xs text-gray-500 mt-2">= {getCurrentAmount() * 12} kr per år</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Namn <span className="text-red-500">*</span>
                </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none" placeholder="Ditt namn" required minLength={2} />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none" placeholder="din@email.se" required />
                <p className="text-xs text-gray-500 mt-1">Du får kvitto och kan hantera din prenumeration via email</p>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={loading || !getCurrentAmount()} className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Laddar..." : "Fortsätt till betalning"}
              </button>

              {/* Links */}
              <div className="text-center space-y-2">
                <Link href="/donations" className="block text-sm text-gray-600 hover:text-primary">
                  ← Tillbaka till engångsgåvor
                </Link>
                <Link href="/donations/manage" className="block text-sm text-primary hover:underline">
                  Hantera befintlig prenumeration
                </Link>
              </div>
            </form>
          </div>

          {/* Right: Info */}
          <div className="space-y-6">
            {/* Benefits */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-primary mb-4">✨ Fördelar</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Automatisk - inget att komma ihåg</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Stöd moskén kontinuerligt</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Ändra belopp när du vill</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Avsluta när du vill</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Säker betalning via Stripe</span>
                </li>
              </ul>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-primary mb-4">📋 Hur det fungerar</h3>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="font-bold text-primary">1.</span>
                  <span>Välj belopp och fyll i dina uppgifter</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">2.</span>
                  <span>Betala säkert med kort via Stripe</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">3.</span>
                  <span>Du blir automatiskt debiterad varje månad</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">4.</span>
                  <span>Får kvitto via email efter varje betalning</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">5.</span>
                  <span>Ändra eller avsluta när som helst</span>
                </li>
              </ol>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-primary mb-4">🔒 Säkerhet</h3>
              <p className="text-sm text-gray-700 mb-3">
                Dina betalningar hanteras av <strong>Stripe</strong> - världens mest betrodda betalningslösning.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ PCI DSS Level 1 certifierad</li>
                <li>✓ Krypterad överföring (SSL/TLS)</li>
                <li>✓ Inga kortuppgifter sparas på vår server</li>
                <li>✓ Följer GDPR och europeiska bankregler</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
