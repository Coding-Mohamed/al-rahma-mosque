// // app/donations/page.jsx - SIMPLIFIED TEST VERSION
// "use client";
// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// export default function DonationsPage() {
//   // ============================================================================
//   // STATE MANAGEMENT
//   // ============================================================================

//   const [activeTab, setActiveTab] = useState("monthly");

//   // Form fields
//   const [amount, setAmount] = useState(0);
//   const [customAmount, setCustomAmount] = useState("");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [personalNumber, setPersonalNumber] = useState("");

//   // TEST: Manual bank account input (bypass iframe)
//   const [clearingNumber, setClearingNumber] = useState("8327");
//   const [accountNumber, setAccountNumber] = useState("1234567890");
//   const [bank, setBank] = useState("Swedbank");

//   // UI state
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Flow control
//   const [currentStep, setCurrentStep] = useState(1);
//   // Step 1: Fill form + bank account
//   // Step 2: Create donation (skip BankID for now)

//   // ============================================================================
//   // CONFIGURATION
//   // ============================================================================

//   const MOSQUE_NAME = "Al-Rahma Moské";
//   const SWISH_NUMBER = "1231553262";
//   const BANKGIRO = "5717-3809";
//   const predefinedAmounts = [50, 100, 250, 500, 1000, 1500];

//   // ============================================================================
//   // HELPER FUNCTIONS
//   // ============================================================================

//   const getCurrentAmount = () => parseInt(customAmount) || amount;

//   const validatePersonalNumber = (pnr) => {
//     const cleaned = pnr.replace(/[-\s]/g, "");
//     return cleaned.length === 12 || cleaned.length === 10;
//   };

//   const formatPersonalNumber = (pnr) => {
//     const cleaned = pnr.replace(/[-\s]/g, "");

//     if (cleaned.length === 12) {
//       return `${cleaned.slice(0, 8)}-${cleaned.slice(8)}`;
//     } else if (cleaned.length === 10) {
//       const year = parseInt(cleaned.slice(0, 2));
//       const century = year <= new Date().getFullYear() % 100 ? "20" : "19";
//       return `${century}${cleaned.slice(0, 6)}-${cleaned.slice(6)}`;
//     }

//     return cleaned;
//   };

//   // ============================================================================
//   // SIMPLIFIED FLOW - SKIP IFRAME AND BANKID FOR TESTING
//   // ============================================================================

//   const handleCreateDonation = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const finalAmount = getCurrentAmount();

//       // Validation
//       if (!finalAmount || finalAmount < 10) {
//         setError("Minsta belopp är 10 kr");
//         setLoading(false);
//         return;
//       }

//       if (!name || name.trim().length < 2) {
//         setError("Vänligen ange ditt fullständiga namn");
//         setLoading(false);
//         return;
//       }

//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!email || !emailRegex.test(email.trim())) {
//         setError("Vänligen ange en giltig e-postadress");
//         setLoading(false);
//         return;
//       }

//       if (!personalNumber || !validatePersonalNumber(personalNumber)) {
//         setError("Vänligen ange ett giltigt personnummer (YYYYMMDD-XXXX)");
//         setLoading(false);
//         return;
//       }

//       if (!clearingNumber || !accountNumber) {
//         setError("Vänligen ange clearing och kontonummer");
//         setLoading(false);
//         return;
//       }

//       console.log("Creating donation with data:", {
//         amount: finalAmount,
//         name: name.trim(),
//         email: email.trim(),
//         personalNumber: formatPersonalNumber(personalNumber),
//         clearingNumber,
//         accountNumber,
//         bank,
//       });

//       // Call API to create donation
//       const response = await fetch("/api/billecta/create-monthly-donation", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: finalAmount,
//           name: name.trim(),
//           email: email.trim(),
//           personalNumber: formatPersonalNumber(personalNumber),
//           clearingNumber: clearingNumber,
//           accountNumber: accountNumber,
//           bank: bank,
//           // Use a dummy BankID token for testing
//           bankIdReferenceToken: "test-token-" + Date.now(),
//         }),
//       });

//       const data = await response.json();

//       console.log("API response:", data);

//       if (!response.ok) {
//         setError(data.error || data.debug?.message || "Kunde inte skapa donation");
//         setLoading(false);
//         return;
//       }

//       // Success!
//       setSuccess(`Tack ${name}! Din månatliga donation på ${finalAmount} kr är nu registrerad!`);
//       setCurrentStep(2);
//       setLoading(false);

//       // Redirect after 3 seconds
//       setTimeout(() => {
//         window.location.href = "/donations/success?type=monthly";
//       }, 3000);
//     } catch (err) {
//       console.error("Create donation error:", err);
//       setError("Något gick fel. Kontakta moskén för hjälp.");
//       setLoading(false);
//     }
//   };

//   // ============================================================================
//   // RENDER
//   // ============================================================================

//   return (
//     <div className="min-h-screen bg-lighter">
//       {/* Header */}
//       <div className="bg-gradient-to-br from-primary to-accent text-white py-12 px-4 rounded-2xl">
//         <div className="max-w-5xl mx-auto text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">Donationer</h1>
//           <p className="text-lg md:text-xl opacity-90 mb-6">Stöd {MOSQUE_NAME} och vår gemenskap</p>

//           {/* Tab Selector */}
//           <div className="inline-flex bg-white/20 backdrop-blur-sm rounded-full p-1 gap-2">
//             <button onClick={() => setActiveTab("monthly")} className={`px-6 md:px-8 py-3 rounded-full font-bold transition-all ${activeTab === "monthly" ? "bg-white text-primary shadow-lg" : "text-white hover:bg-white/10"}`}>
//               Månatlig Donation (TEST)
//             </button>
//             <button onClick={() => setActiveTab("swish")} className={`px-6 md:px-8 py-3 rounded-full font-bold transition-all ${activeTab === "swish" ? "bg-white text-primary shadow-lg" : "text-white hover:bg-white/10"}`}>
//               Swish/Bankgiro
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-5xl mx-auto px-4 py-12">
//         {/* SWISH TAB - Keep as before */}
//         {activeTab === "swish" && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             <div className="bg-white rounded-2xl shadow-xl p-8">
//               <div className="text-center mb-6">
//                 <h2 className="text-3xl font-bold text-primary mb-2">Scanna & Donera</h2>
//                 <p className="text-gray-600">Öppna Swish-appen och scanna QR-koden</p>
//               </div>
//               <div className="flex justify-center mb-6">
//                 <div className="relative w-80 h-80 bg-lighter rounded-2xl p-6 border-4 border-primary shadow-lg">
//                   <Image src="/QR-code.png" alt="Swish QR Code" fill className="object-contain p-2" priority />
//                 </div>
//               </div>
//               <div className="bg-primary/10 rounded-xl p-4 text-center mb-6">
//                 <p className="text-sm text-gray-600 mb-1">Swish-nummer:</p>
//                 <p className="text-2xl font-bold text-primary">{SWISH_NUMBER}</p>
//               </div>
//             </div>

//             <div className="space-y-6">
//               <div className="bg-white rounded-2xl shadow-xl p-6">
//                 <h3 className="text-xl font-bold text-primary mb-4">🏦 Bankgiro</h3>
//                 <div className="bg-lighter rounded-lg p-4 mb-4">
//                   <p className="text-sm text-gray-600 mb-1">Bankgironummer:</p>
//                   <p className="text-2xl font-bold text-primary">{BANKGIRO}</p>
//                 </div>
//                 <p className="text-sm text-gray-600">
//                   <strong>Mottagare:</strong> {MOSQUE_NAME}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* MONTHLY TAB - SIMPLIFIED VERSION */}
//         {activeTab === "monthly" && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Left Column - Form */}
//             <div className="bg-white rounded-2xl shadow-xl p-8">
//               <div className="bg-blue-100 border-2 border-blue-400 text-blue-800 px-4 py-3 rounded-lg mb-6">
//                 ℹ️ <strong>TESTVERSION:</strong> BankID & Autogiro är nu aktiverat i Billecta! Testa med dina uppgifter.
//               </div>

//               {/* Error/Success */}
//               {error && <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">⚠️ {error}</div>}

//               {success && <div className="bg-green-100 border-2 border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">✓ {success}</div>}

//               {currentStep === 1 && (
//                 <form onSubmit={handleCreateDonation} className="space-y-6">
//                   <div className="text-center mb-6">
//                     <h2 className="text-3xl font-bold text-primary mb-2">Månatlig Donation (Test)</h2>
//                     <p className="text-gray-600">Fyll i uppgifter och testbankkonto</p>
//                   </div>

//                   {/* Amount */}
//                   <div>
//                     <label className="block text-sm font-bold text-primary mb-3">Välj månadsbelopp:</label>
//                     <div className="grid grid-cols-3 gap-3 mb-3">
//                       {predefinedAmounts.map((amt) => (
//                         <button
//                           key={amt}
//                           type="button"
//                           onClick={() => {
//                             setAmount(amt);
//                             setCustomAmount("");
//                           }}
//                           className={`p-4 rounded-lg font-bold text-lg transition-all ${amount === amt && !customAmount ? "bg-primary text-white shadow-lg scale-105" : "bg-lighter text-primary hover:bg-gray-200"}`}
//                         >
//                           {amt} kr
//                         </button>
//                       ))}
//                     </div>
//                     <input
//                       type="number"
//                       min="10"
//                       placeholder="Eller ange eget belopp"
//                       value={customAmount}
//                       onChange={(e) => {
//                         setCustomAmount(e.target.value);
//                         setAmount(0);
//                       }}
//                       className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
//                     />
//                   </div>

//                   {getCurrentAmount() > 0 && (
//                     <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border-2 border-primary/20">
//                       <div className="text-center">
//                         <p className="text-sm text-gray-600 mb-1">Du donerar varje månad:</p>
//                         <p className="text-4xl font-bold text-primary mb-1">{getCurrentAmount()} kr</p>
//                         <p className="text-sm text-gray-600">= {getCurrentAmount() * 12} kr per år</p>
//                       </div>
//                     </div>
//                   )}

//                   {/* Name */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Namn <span className="text-red-500">*</span>
//                     </label>
//                     <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none" placeholder="Ditt fullständiga namn" required />
//                   </div>

//                   {/* Email */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Email <span className="text-red-500">*</span>
//                     </label>
//                     <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none" placeholder="din@email.se" required />
//                   </div>

//                   {/* Personal Number */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Personnummer <span className="text-red-500">*</span>
//                     </label>
//                     <input type="text" value={personalNumber} onChange={(e) => setPersonalNumber(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none" placeholder="YYYYMMDD-XXXX (test: 19800113-9297)" required />
//                     <p className="text-xs text-gray-500 mt-2">💡 Använd test-nummer: 19800113-9297</p>
//                   </div>

//                   {/* Bank Account - Manual Input for Testing */}
//                   <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
//                     <h3 className="font-bold text-blue-900 mb-3">📋 Bankkonto (Test - Manuell Inmatning)</h3>

//                     <div className="space-y-3">
//                       {/* Clearing Number */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Clearingnummer</label>
//                         <input type="text" value={clearingNumber} onChange={(e) => setClearingNumber(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none" placeholder="8327" />
//                       </div>

//                       {/* Account Number */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Kontonummer</label>
//                         <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none" placeholder="1234567890" />
//                       </div>

//                       {/* Bank */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
//                         <select value={bank} onChange={(e) => setBank(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none">
//                           <option value="Swedbank">Swedbank</option>
//                           <option value="SEB">SEB</option>
//                           <option value="Handelsbanken">Handelsbanken</option>
//                           <option value="Nordea">Nordea</option>
//                           <option value="Danske Bank">Danske Bank</option>
//                         </select>
//                       </div>
//                     </div>

//                     <p className="text-xs text-blue-600 mt-3">💡 Testdata är förifylld. I produktion används iframe.</p>
//                   </div>

//                   {/* Submit */}
//                   <button type="submit" disabled={loading || !getCurrentAmount() || !name || !email || !personalNumber} className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
//                     {loading ? (
//                       <span className="flex items-center justify-center gap-2">
//                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                         Skapar donation...
//                       </span>
//                     ) : (
//                       "Skapa Månatlig Donation (Test)"
//                     )}
//                   </button>
//                 </form>
//               )}

//               {/* Success Step */}
//               {currentStep === 2 && (
//                 <div className="text-center py-8">
//                   <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <span className="text-4xl">✓</span>
//                   </div>
//                   <h3 className="text-2xl font-bold text-primary mb-2">Klart!</h3>
//                   <p className="text-gray-600 mb-4">Din månatliga donation har skapats i Billecta testsystem</p>
//                   <p className="text-sm text-gray-500">Kontrollera i Billecta-portalen under "Contract Invoices"</p>
//                 </div>
//               )}
//             </div>

//             {/* Right Column - Info */}
//             <div className="space-y-6">
//               <div className="bg-white rounded-2xl shadow-xl p-6">
//                 <h3 className="text-xl font-bold text-primary mb-4">📝 Testinstruktioner</h3>
//                 <div className="space-y-3 text-sm">
//                   <div className="p-3 bg-lighter rounded-lg">
//                     <p className="font-bold mb-1">1. Fyll i formuläret</p>
//                     <p className="text-gray-600">Använd test-personnummer: 19800113-9297</p>
//                   </div>
//                   <div className="p-3 bg-lighter rounded-lg">
//                     <p className="font-bold mb-1">2. Bankkonto</p>
//                     <p className="text-gray-600">Testdata är förifylld (Clearing: 8327)</p>
//                   </div>
//                   <div className="p-3 bg-lighter rounded-lg">
//                     <p className="font-bold mb-1">3. Skapa donation</p>
//                     <p className="text-gray-600">Klicka på knappen</p>
//                   </div>
//                   <div className="p-3 bg-lighter rounded-lg">
//                     <p className="font-bold mb-1">4. Kontrollera i Billecta</p>
//                     <p className="text-gray-600">Logga in på apptest.billecta.com</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-2xl shadow-xl p-6">
//                 <h3 className="text-xl font-bold text-primary mb-4">🔍 Vad händer?</h3>
//                 <ul className="space-y-2 text-sm text-gray-600">
//                   <li>✓ Debtor skapas med Autogiro</li>
//                   <li>✓ Contract Invoice skapas</li>
//                   <li>✓ Första uttag: nästa månad</li>
//                   <li>✓ Autogiro-medgivande skickas</li>
//                 </ul>
//               </div>

//               <div className="bg-white rounded-2xl shadow-xl p-6">
//                 <h3 className="text-xl font-bold text-primary mb-4">🏦 Kontrollera i Billecta</h3>
//                 <p className="text-sm text-gray-700 mb-3">Efter att ha skapat donation:</p>
//                 <ol className="space-y-2 text-sm text-gray-600">
//                   <li>1. Gå till https://apptest.billecta.com</li>
//                   <li>2. Klicka på "Contract Invoices" (Avtalsfakturor)</li>
//                   <li>3. Du ska se din nya donation!</li>
//                   <li>4. Klicka på "Debtors" för att se kunden</li>
//                 </ol>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// app/donations/page.js
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
  const [showBankID, setShowBankID] = useState(false);
  const [contractInvoiceId, setContractInvoiceId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Step 1: Create contract invoice
      const response = await fetch("/api/billecta/create-monthly-donation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Något gick fel");
      }

      // Step 2: Show BankID modal for signing
      setContractInvoiceId(data.contractInvoiceId);
      setShowBankID(true);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleBankIDSuccess = () => {
    // Redirect to success page after successful BankID signing
    router.push(`/donations/success?type=monthly&contractId=${contractInvoiceId}`);
  };

  const handleBankIDClose = () => {
    setShowBankID(false);
    setError("BankID-signering avbruten. Avtalet är skapat men måste signeras för att aktiveras.");
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
            {/* Info Card 1 */}
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

            {/* Info Card 2 */}
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

            {/* Info Card 3 */}
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
          </div>

          {/* Right Column - Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-2xl p-8 border-t-4 border-[#d4a574]">
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Fyll i Dina Uppgifter</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-[#1e3a5f] mb-2">Belopp (kr/månad) *</label>
                  <div className="relative">
                    <input type="number" required min="50" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a574] focus:border-[#d4a574] text-lg transition-all" placeholder="500" />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-semibold">kr</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum 50 kr per månad</p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#1e3a5f] mb-2">Namn *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a574] focus:border-[#d4a574] transition-all" placeholder="Ditt fullständiga namn" />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-[#1e3a5f] mb-2">E-postadress *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a574] focus:border-[#d4a574] transition-all" placeholder="din@email.com" />
                  <p className="text-xs text-gray-500 mt-1">För bekräftelse och kvitton</p>
                </div>

                {/* Personal Number */}
                <div>
                  <label className="block text-sm font-semibold text-[#1e3a5f] mb-2">Personnummer (ÅÅÅÅMMDD-XXXX) *</label>
                  <input type="text" required value={formData.personalNumber} onChange={(e) => setFormData({ ...formData, personalNumber: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a574] focus:border-[#d4a574] transition-all" placeholder="19900101-1234" pattern="[0-9]{8}-[0-9]{4}" />
                  <p className="text-xs text-gray-500 mt-1">Används för BankID-verifiering</p>
                </div>

                {/* How it works */}
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

                {/* Error Message */}
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

                {/* Submit Button */}
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

                {/* Legal Text */}
                <p className="text-xs text-gray-500 text-center leading-relaxed">Genom att fortsätta godkänner du att månatliga autogirobetalningar dras från ditt konto. Du kan när som helst avsluta din donation genom att kontakta moskén.</p>
              </form>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-white rounded-lg shadow-lg p-6 border-t-2 border-[#d4a574]">
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

      {/* BankID Modal */}
      {showBankID && <BankIDModal contractInvoiceId={contractInvoiceId} personalNumber={formData.personalNumber} onSuccess={handleBankIDSuccess} onClose={handleBankIDClose} />}
    </div>
  );
}
