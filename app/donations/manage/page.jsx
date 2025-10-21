// app/donations/manage/page.jsx
"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ManageSubscriptionPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("update"); // 'update' or 'cancel'

  // Check if user came from checkout cancellation
  const checkoutCancelled = searchParams.get("checkout") === "cancelled";

  const predefinedAmounts = [50, 100, 250, 500, 1000];

  const handleUpdateAmount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (newAmount < 10) {
        setError("Minsta belopp är 10 kr");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/update-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          newAmount: parseInt(newAmount),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Ditt månatliga belopp har ändrats till ${newAmount} kr`);
        setNewAmount("");
      } else {
        setError(data.error || "Kunde inte uppdatera prenumerationen");
      }
    } catch (err) {
      console.error(err);
      setError("Något gick fel. Försök igen.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (e) => {
    e.preventDefault();

    const confirmed = window.confirm("Är du säker på att du vill avsluta din månatliga donation?\n\n" + "Du kommer inte längre att debiteras automatiskt.");

    if (!confirmed) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ " + data.message);
        setEmail("");
      } else {
        setError(data.error || "Kunde inte avsluta prenumerationen");
      }
    } catch (err) {
      console.error(err);
      setError("Något gick fel. Försök igen.");
    } finally {
      setLoading(false);
    }
  };

  // If user came from cancelled checkout
  if (checkoutCancelled) {
    return (
      <div className="min-h-screen bg-lighter py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-3xl font-bold text-primary mb-4">Betalning avbruten</h1>
            <p className="text-lg text-gray-700 mb-6">Din betalning genomfördes inte. Ingen prenumeration har skapats.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/donations/monthly" className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent transition">
                Försök igen
              </Link>
              <Link href="/donations" className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition">
                Tillbaka till donationer
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lighter py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Hantera din prenumeration</h1>
          <p className="text-gray-600">Ändra belopp eller avsluta din månatliga donation</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-2xl shadow-xl">
          <div className="flex border-b border-gray-200">
            <button onClick={() => setActiveTab("update")} className={`flex-1 py-4 px-6 font-semibold transition ${activeTab === "update" ? "bg-primary text-white border-b-4 border-accent" : "text-gray-600 hover:bg-gray-50"}`}>
              📊 Ändra belopp
            </button>
            <button onClick={() => setActiveTab("cancel")} className={`flex-1 py-4 px-6 font-semibold transition ${activeTab === "cancel" ? "bg-red-600 text-white border-b-4 border-red-800" : "text-gray-600 hover:bg-gray-50"}`}>
              🚫 Avsluta
            </button>
          </div>

          <div className="p-8">
            {/* Messages */}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

            {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}

            {/* Update Amount Tab */}
            {activeTab === "update" && (
              <form onSubmit={handleUpdateAmount} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-4">Ändra månadsbelopp</h3>
                  <p className="text-sm text-gray-600 mb-4">Ditt nya belopp kommer att gälla från nästa månads betalning</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Din email <span className="text-red-500">*</span>
                  </label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none" placeholder="din@email.se" required />
                </div>

                {/* New Amount - Quick Select */}
                <div>
                  <label className="block text-sm font-medium mb-3">Nytt månadsbelopp:</label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {predefinedAmounts.map((amt) => (
                      <button key={amt} type="button" onClick={() => setNewAmount(amt.toString())} className={`p-3 rounded-lg font-bold transition ${newAmount === amt.toString() ? "bg-primary text-white" : "bg-lighter text-primary hover:bg-gray-200"}`}>
                        {amt} kr
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <input type="number" min="10" placeholder="Eller ange eget belopp (min 10 kr)" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none" required />
                </div>

                {/* Selected Amount Display */}
                {newAmount > 0 && (
                  <div className="bg-lighter rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Nytt månadsbelopp:</p>
                    <p className="text-3xl font-bold text-primary">{newAmount} kr</p>
                    <p className="text-xs text-gray-500 mt-2">= {newAmount * 12} kr per år</p>
                  </div>
                )}

                {/* Submit Button */}
                <button type="submit" disabled={loading || !newAmount} className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Uppdaterar..." : "Uppdatera belopp"}
                </button>
              </form>
            )}

            {/* Cancel Subscription Tab */}
            {activeTab === "cancel" && (
              <form onSubmit={handleCancelSubscription} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-red-600 mb-4">Avsluta prenumeration</h3>
                  <p className="text-sm text-gray-600 mb-4">När du avslutar din prenumeration kommer du inte längre att debiteras automatiskt varje månad.</p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800">⚠️ Du kan alltid sätta upp en ny månatlig donation senare om du ångrar dig.</p>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Din email <span className="text-red-500">*</span>
                  </label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none" placeholder="din@email.se" required />
                  <p className="text-xs text-gray-500 mt-1">Den email du använde när du skapade prenumerationen</p>
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Avslutar..." : "Avsluta prenumeration"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <Link href="/donations" className="block text-primary hover:underline">
            ← Tillbaka till donationer
          </Link>
          <Link href="/donations/monthly" className="block text-gray-600 hover:text-primary text-sm">
            Sätt upp ny månatlig donation
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-primary mb-3">Behöver du hjälp?</h3>
          <p className="text-sm text-gray-600 mb-4">Om du har problem med att hantera din prenumeration, kontakta oss:</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span>📧</span>
              <span>info@alrahmamoske.se</span>
            </li>
            <li className="flex items-center gap-2">
              <span>📞</span>
              <span>+46 737739772</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
