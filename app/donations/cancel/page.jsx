// app/donations/cancel/page.jsx

"use client";
import { useState } from "react";

export default function CancelPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showCheckoutCancel, setShowCheckoutCancel] = useState(false);

  // Check if user came from checkout cancellation
  useState(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("checkout") === "cancelled") {
        setShowCheckoutCancel(true);
      }
    }
  }, []);

  const handleCancelSubscription = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ " + data.message);
        setEmail("");
      } else {
        setError("❌ " + data.error);
      }
    } catch (err) {
      setError("❌ Något gick fel. Försök igen.");
    } finally {
      setLoading(false);
    }
  };

  // Show checkout cancellation message if user came from Stripe checkout
  if (showCheckoutCancel) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-primary mb-4">Donation avbruten</h1>
          <p className="text-lg text-gray-700 mb-6">Din betalning genomfördes inte.</p>
          <div className="flex gap-4 justify-center">
            <a href="/monthly-donations" className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent transition">
              Försök igen
            </a>
            <a href="/" className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition">
              Tillbaka
            </a>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <button onClick={() => setShowCheckoutCancel(false)} className="text-red-600 hover:underline">
              Eller avsluta en befintlig prenumeration →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show subscription cancellation form
  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">🚫 Avsluta Prenumeration</h1>

        <p className="text-gray-600 mb-6 text-center">Ange din email för att avsluta din månatliga donation</p>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}

        <form onSubmit={handleCancelSubscription} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500" placeholder="din@email.se" required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50">
            {loading ? "Avslutar..." : "Avsluta Prenumeration"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <a href="/monthly-donations" className="block text-primary hover:underline text-sm">
            ← Tillbaka till donationer
          </a>
          <button onClick={() => setShowCheckoutCancel(true)} className="block w-full text-gray-500 hover:underline text-sm">
            Kom hit från avbruten betalning?
          </button>
        </div>
      </div>
    </div>
  );
}
