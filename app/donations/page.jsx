// // app/donations/page.jsx - SIMPLIFIED TEST VERSION

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BankIDModal from "@/components/BankIDModal";

export default function DonationsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    amount: "",
    name: "",
    email: "",
    personalNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showBankID, setShowBankID] = useState(false); // ✅ opens modal immediately on submit

  // ✅ Step 1: Just validate + show BankID modal — no API call yet
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Basic client-side validation before opening modal
    const amount = parseInt(formData.amount);
    if (isNaN(amount) || amount < 50) {
      setError("Beloppet måste vara minst 50 kr");
      return;
    }
    if (!formData.personalNumber.match(/^\d{6,8}-?\d{4}$/)) {
      setError("Ogiltigt personnummer format (ÅÅMMDD-XXXX)");
      return;
    }

    setShowBankID(true); // open modal — nothing created yet
  };

  // ✅ Step 2: BankID signed successfully — NOW create the member
  const handleBankIDSuccess = async (bankIdReferenceToken) => {
    setShowBankID(false);
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/billecta/create-monthly-donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          bankIdReferenceToken, // ✅ required — server verifies this before creating anything
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Något gick fel");
      }

      // ✅ Only now redirect to success
      router.push(`/donations/success?type=monthly&contractId=${data.contractInvoiceId}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleBankIDClose = () => {
    setShowBankID(false);
    // No error message needed — nothing was created, user just closed the modal
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#1e3a5f] mb-4">Månatlig Donation</h1>
          <p className="text-xl text-[#1e3a5f]/80">Stöd Al-Rahma Moskée med en månatlig donation via Autogiro</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#d4a574]">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-[#d4a574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">Varför Månatligt?</h3>
                  <p className="text-sm text-gray-600">Månatliga donationer hjälper oss att planera långsiktigt och driva moskéns verksamhet kontinuerligt.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#d4a574]">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-[#d4a574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">Säker Betalning</h3>
                  <p className="text-sm text-gray-600">BankID-verifiering och autogiro via Billecta garanterar säkra och transparenta transaktioner.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#d4a574]">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-[#d4a574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">Avsluta När Som Helst</h3>
                  <p className="text-sm text-gray-600">Du kan när som helst avsluta din månatliga donation genom att kontakta moskén.</p>
                </div>
              </div>
            </div>
            <div className="mt-12 text-center">
              <div className="inline-block bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#d4a574]">
                <p className="text-[#1e3a5f] font-semibold mb-2">Har du frågor?</p>
                <p className="text-gray-600">
                  Kontakta oss på{" "}
                  <a href="mailto:info@alrahmamoske.se" className="text-[#d4a574] hover:underline font-semibold">
                    info@alrahmamoske.se
                  </a>{" "}
                  eller ring{" "}
                  <a href="tel:+46737739772" className="text-[#d4a574] hover:underline font-semibold">
                    +46 73 773 97 72
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-2xl p-8 border-t-4 border-[#d4a574]">
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Fyll i Dina Uppgifter</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1e3a5f] mb-2">Belopp (kr/månad) *</label>
                  <div className="relative">
                    <input type="number" required min="50" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a574] focus:border-[#d4a574] text-lg transition-all" placeholder="500" />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-semibold">kr</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum 50 kr per månad</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1e3a5f] mb-2">Namn *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a574] focus:border-[#d4a574] transition-all" placeholder="Ditt fullständiga namn" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1e3a5f] mb-2">E-postadress *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a574] focus:border-[#d4a574] transition-all" placeholder="din@email.com" />
                  <p className="text-xs text-gray-500 mt-1">För bekräftelse och kvitton</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1e3a5f] mb-2">Personnummer (ÅÅMMDD-XXXX) *</label>
                  <input type="text" required value={formData.personalNumber} onChange={(e) => setFormData({ ...formData, personalNumber: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a574] focus:border-[#d4a574] transition-all" placeholder="19900101-1234" pattern="[0-9]{8}-[0-9]{4}" />
                  <p className="text-xs text-gray-500 mt-1">Används för BankID-verifiering</p>
                </div>

                <div className="bg-[#f5f1e8] border-2 border-[#d4a574] rounded-lg p-5">
                  <h3 className="font-bold text-[#1e3a5f] mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#d4a574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Så Fungerar Det
                  </h3>
                  <ol className="text-sm text-[#1e3a5f] space-y-2">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#d4a574] text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                      <span>Fyll i dina uppgifter ovan</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#d4a574] text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                      <span>Signera med BankID för att godkänna autogiro</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#d4a574] text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                      <span>Klart! Beloppet dras automatiskt varje månad</span>
                    </li>
                  </ol>
                </div>

                {error && (
                  <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-semibold flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Ett fel uppstod
                    </p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full bg-[#1e3a5f] hover:bg-[#2c5079] text-white py-4 rounded-lg font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg">
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Skapar avtal...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Fortsätt till BankID
                    </span>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center leading-relaxed">Ditt avtal skapas först efter att du godkänt med BankID. Inga betalningar sker utan din signering.</p>
              </form>
              {/* <div className="mt-6 text-center">
                <a href="/donations/manage" className="inline-flex items-center gap-2 text-[#1e3a5f]/60 hover:text-[#1e3a5f] text-sm transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Har du redan en donation? Hantera den här
                </a>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {/* 
  ADD THIS at the very bottom of your donations/page.js, 
  just above the closing </div> of the outer div (after the "Har du frågor?" section)
*/}

      {/* BankID Modal — shown before any API call */}
      {showBankID && <BankIDModal contractInvoiceId="pending" personalNumber={formData.personalNumber} onSuccess={handleBankIDSuccess} onClose={handleBankIDClose} />}
    </div>
  );
}
