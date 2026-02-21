// // donation/manage/page.jsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import BankIDModal from "@/components/BankIDModal";

// const STEPS = { FORM: "form", BANKID: "bankid", DASHBOARD: "dashboard", CONFIRM_CANCEL: "confirm_cancel", CONFIRM_UPDATE: "confirm_update", DONE: "done" };

// export default function ManagePage() {
//   const router = useRouter();
//   const [step, setStep] = useState(STEPS.FORM);
//   const [personalNumber, setPersonalNumber] = useState("");
//   const [formError, setFormError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [contract, setContract] = useState(null);
//   const [newAmount, setNewAmount] = useState("");
//   const [doneMessage, setDoneMessage] = useState("");
//   const [pendingAction, setPendingAction] = useState(null); // "cancel" | "update"

//   // Step 1: validate form and open BankID
//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     setFormError("");
//     if (!personalNumber.match(/^\d{6,8}-?\d{4}$/)) {
//       setFormError("Ogiltigt personnummer (ÅÅMMDD-XXXX)");
//       return;
//     }
//     setStep(STEPS.BANKID);
//     setPendingAction("lookup");
//   };

//   // Step 2: BankID success → look up contract
//   const handleBankIDSuccess = async (bankIdReferenceToken) => {
//     setStep(STEPS.FORM);
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch("/api/billecta/get-contract", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ personalNumber, bankIdReferenceToken }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Kunde inte hämta avtal");
//       setContract({ ...data.contract, bankIdToken: bankIdReferenceToken });
//       setNewAmount(data.contract.amount?.toString() || "");
//       setStep(STEPS.DASHBOARD);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Cancel flow: re-verify with BankID
//   const handleCancelClick = () => {
//     setPendingAction("cancel");
//     setStep(STEPS.BANKID);
//   };

//   // Update flow: re-verify with BankID
//   const handleUpdateClick = () => {
//     if (!newAmount || parseInt(newAmount) < 50) {
//       setError("Beloppet måste vara minst 50 kr");
//       return;
//     }
//     setPendingAction("update");
//     setStep(STEPS.BANKID);
//   };

//   // BankID success for cancel/update
//   const handleActionBankIDSuccess = async (bankIdReferenceToken) => {
//     setStep(STEPS.DASHBOARD);
//     setLoading(true);
//     setError("");
//     try {
//       if (pendingAction === "cancel") {
//         const res = await fetch("/api/billecta/cancel-contract", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ contractId: contract.id, bankIdReferenceToken }),
//         });
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || "Kunde inte avsluta avtalet");
//         setDoneMessage("Din månatliga donation har avslutats. Tack för ditt stöd till Al-Rahma Moskée.");
//         setStep(STEPS.DONE);
//       } else if (pendingAction === "update") {
//         const res = await fetch("/api/billecta/update-contract", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             contractId: contract.id,
//             debtorId: contract.debtorId,
//             newAmount: parseInt(newAmount),
//             bankIdReferenceToken,
//           }),
//         });
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || "Kunde inte uppdatera avtalet");
//         setDoneMessage(`Ditt avtal har uppdaterats till ${newAmount} kr/månad.`);
//         setStep(STEPS.DONE);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBankIDClose = () => {
//     setStep(contract ? STEPS.DASHBOARD : STEPS.FORM);
//     setPendingAction(null);
//   };

//   // ── DONE screen ───────────────────────────────────────────────────────────
//   if (step === STEPS.DONE) {
//     return (
//       <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-10 text-center border-t-4 border-[#d4a574]">
//           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">Klart!</h2>
//           <p className="text-gray-600 mb-8">{doneMessage}</p>
//           <button onClick={() => router.push("/")} className="w-full bg-[#1e3a5f] text-white py-3 rounded-xl font-semibold hover:bg-[#2c5079] transition">
//             Tillbaka till startsidan
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ── DASHBOARD screen ──────────────────────────────────────────────────────
//   if (step === STEPS.DASHBOARD) {
//     return (
//       <div className="min-h-screen bg-[#f5f1e8] py-16 px-4">
//         <div className="max-w-lg mx-auto">
//           <div className="text-center mb-10">
//             <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">Hantera Donation</h1>
//             <p className="text-[#1e3a5f]/70">Ditt aktiva autogiroavtal</p>
//           </div>

//           {/* Contract card */}
//           <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-[#d4a574] mb-6">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Donationsbelopp</p>
//                 <p className="text-4xl font-bold text-[#1e3a5f]">
//                   {contract?.amount} <span className="text-xl font-normal text-gray-500">kr/mån</span>
//                 </p>
//               </div>
//               <div className={`px-3 py-1 rounded-full text-sm font-semibold ${contract?.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{contract?.status === "Active" ? "Aktiv" : contract?.status || "Aktiv"}</div>
//             </div>

//             <div className="border-t border-gray-100 pt-4 space-y-3">
//               {contract?.debtorName && (
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Namn</span>
//                   <span className="font-medium text-gray-800">{contract.debtorName}</span>
//                 </div>
//               )}
//               {contract?.nextPayment && (
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Nästa betalning</span>
//                   <span className="font-medium text-gray-800">{new Date(contract.nextPayment).toLocaleDateString("sv-SE")}</span>
//                 </div>
//               )}
//               {contract?.created && (
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Startdatum</span>
//                   <span className="font-medium text-gray-800">{new Date(contract.created).toLocaleDateString("sv-SE")}</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Update amount */}
//           <div className="bg-white rounded-2xl shadow-xl p-8 mb-4">
//             <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">Ändra belopp</h3>
//             <div className="flex gap-3">
//               <div className="relative flex-1">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">kr</span>
//                 <input
//                   type="number"
//                   min="50"
//                   value={newAmount}
//                   onChange={(e) => {
//                     setNewAmount(e.target.value);
//                     setError("");
//                   }}
//                   className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d4a574] focus:border-[#d4a574] text-lg transition"
//                   placeholder="500"
//                 />
//               </div>
//               <button onClick={handleUpdateClick} disabled={loading || parseInt(newAmount) === contract?.amount} className="px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-semibold hover:bg-[#2c5079] disabled:bg-gray-300 disabled:cursor-not-allowed transition">
//                 {loading && pendingAction === "update" ? "..." : "Uppdatera"}
//               </button>
//             </div>
//             <p className="text-xs text-gray-400 mt-2">Kräver ny BankID-signering. Minimum 50 kr/mån.</p>
//           </div>

//           {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}

//           {/* Cancel */}
//           <div className="bg-white rounded-2xl shadow-xl p-6">
//             <h3 className="text-lg font-bold text-gray-700 mb-2">Avsluta donation</h3>
//             <p className="text-sm text-gray-500 mb-4">Om du avslutar din donation stannar inga fler belopp. Du kan alltid starta igen.</p>
//             <button onClick={handleCancelClick} disabled={loading} className="w-full py-3 border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 disabled:opacity-50 transition">
//               Avsluta min donation
//             </button>
//           </div>
//         </div>

//         {/* BankID modal for cancel/update actions */}
//         {step === STEPS.BANKID && <BankIDModal contractInvoiceId="pending" personalNumber={personalNumber} onSuccess={handleActionBankIDSuccess} onClose={handleBankIDClose} />}
//       </div>
//     );
//   }

//   // ── FORM + BANKID screen ──────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center p-4">
//       <div className="max-w-md w-full">
//         <div className="text-center mb-10">
//           <div className="w-16 h-16 bg-[#1e3a5f] rounded-2xl flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-[#d4a574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//             </svg>
//           </div>
//           <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Hantera Donation</h1>
//           <p className="text-[#1e3a5f]/70">Ange ditt personnummer och verifiera med BankID för att se ditt avtal.</p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-[#d4a574]">
//           <form onSubmit={handleFormSubmit} className="space-y-5">
//             <div>
//               <label className="block text-sm font-semibold text-[#1e3a5f] mb-2">Personnummer</label>
//               <input
//                 type="text"
//                 required
//                 value={personalNumber}
//                 onChange={(e) => {
//                   setPersonalNumber(e.target.value);
//                   setFormError("");
//                 }}
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d4a574] focus:border-[#d4a574] transition text-lg"
//                 placeholder="19900101-1234"
//                 pattern="[0-9]{8}-[0-9]{4}"
//               />
//               {formError && <p className="text-red-500 text-sm mt-1">{formError}</p>}
//             </div>

//             {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

//             <button type="submit" disabled={loading} className="w-full bg-[#1e3a5f] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#2c5079] disabled:bg-gray-400 transition flex items-center justify-center gap-2">
//               {loading ? (
//                 <>
//                   <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                   </svg>
//                   Hämtar avtal...
//                 </>
//               ) : (
//                 <>
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   Fortsätt till BankID
//                 </>
//               )}
//             </button>
//           </form>

//           <p className="text-xs text-gray-400 text-center mt-4">Dina uppgifter skyddas av BankID-verifiering. Vi delar aldrig din information.</p>
//         </div>
//       </div>

//       {step === STEPS.BANKID && pendingAction === "lookup" && (
//         <BankIDModal
//           contractInvoiceId="pending"
//           personalNumber={personalNumber}
//           onSuccess={handleBankIDSuccess}
//           onClose={() => {
//             setStep(STEPS.FORM);
//             setPendingAction(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }
// app/donations/manage/page.js
// TODO: implement donor self-service management page

export default function ManagePage() {
  return null;
}
