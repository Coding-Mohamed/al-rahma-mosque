// // // app/donations/success/page.jsx
// "use client";

// import { useSearchParams } from "next/navigation";
// import Link from "next/link";

// export default function DonationSuccessPage() {
//   const searchParams = useSearchParams();
//   const contractId = searchParams.get("contractId");
//   const amount = searchParams.get("amount");

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-12 px-4">
//       <div className="max-w-2xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           {/* Success Icon */}
//           <div className="text-center mb-6">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
//               <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Donation Skapad!</h1>
//             <p className="text-gray-600">Tack för ditt stöd till Al-Rahma Moskée</p>
//           </div>

//           {/* Contract Info */}
//           {contractId && (
//             <div className="bg-gray-50 rounded-lg p-4 mb-6">
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <p className="text-gray-600">Belopp per månad</p>
//                   <p className="font-semibold text-gray-900">{amount} kr</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-600">Avtalsnummer</p>
//                   <p className="font-semibold text-gray-900">{contractId}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Next Steps */}
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
//             <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
//               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//               </svg>
//               Nästa steg: Signera med BankID
//             </h2>
//             <ol className="space-y-3 text-blue-800">
//               <li className="flex items-start">
//                 <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
//                 <div>
//                   <p className="font-semibold">Kolla din email</p>
//                   <p className="text-sm text-blue-700">Du får ett email från Billecta inom några minuter</p>
//                 </div>
//               </li>
//               <li className="flex items-start">
//                 <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
//                 <div>
//                   <p className="font-semibold">Klicka på länken i emailet</p>
//                   <p className="text-sm text-blue-700">Du kommer till Billectas säkra signeringssida</p>
//                 </div>
//               </li>
//               <li className="flex items-start">
//                 <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
//                 <div>
//                   <p className="font-semibold">Signera med BankID</p>
//                   <p className="text-sm text-blue-700">Använd din BankID-app för att godkänna autogiro</p>
//                 </div>
//               </li>
//               <li className="flex items-start">
//                 <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">✓</span>
//                 <div>
//                   <p className="font-semibold">Klart!</p>
//                   <p className="text-sm text-blue-700">Din månatliga donation är aktiverad</p>
//                 </div>
//               </li>
//             </ol>
//           </div>

//           {/* Warning about spam */}
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
//             <div className="flex items-start">
//               <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//               <div className="text-sm text-yellow-800">
//                 <p className="font-semibold mb-1">Kom ihåg att kolla spam-mappen!</p>
//                 <p className="text-yellow-700">Ibland hamnar emailet från Billecta i spam. Kolla där om du inte ser något inom 5 minuter.</p>
//               </div>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-4">
//             <Link href="/donations" className="flex-1 text-center bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition">
//               Skapa En Till
//             </Link>
//             <Link href="/" className="flex-1 text-center bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition">
//               Tillbaka Hem
//             </Link>
//           </div>

//           {/* Footer */}
//           <p className="mt-6 text-xs text-center text-gray-500">Vid frågor, kontakta Al-Rahma Moskée</p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const contractId = searchParams.get("contractId");
  const amount = searchParams.get("amount");

  return (
    <div className="min-h-screen bg-[#f5f1e8] py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center border-t-4 border-[#d4a574]">
          {/* Success Icon */}
          <div className="mb-6">
            <svg className="w-20 h-20 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-[#1e3a5f] mb-4">Tack för din donation! 🎉</h1>

          <p className="text-lg text-gray-600 mb-8">Din månatliga donation har skapats framgångsrikt</p>

          {/* Donation Details */}
          <div className="bg-[#f5f1e8] rounded-lg p-6 mb-8">
            <p className="text-lg text-[#1e3a5f] mb-2">
              <strong>Belopp:</strong> {amount} kr/månad
            </p>
            <p className="text-sm text-gray-600">Avtalsfaktura ID: {contractId}</p>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6 text-left">
            <h2 className="font-bold text-[#1e3a5f] mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#d4a574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Nästa Steg: BankID-signering
            </h2>
            <ol className="text-sm text-[#1e3a5f] space-y-3">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-[#d4a574] text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                <span>
                  Kolla din <strong>email</strong> (även i skräpposten!)
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-[#d4a574] text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                <span>
                  Öppna emailet från <strong>Billecta</strong>
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-[#d4a574] text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                <span>Klicka på BankID-länken i emailet</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-[#d4a574] text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                <span>
                  Signera med <strong>BankID</strong> på din mobil
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-[#d4a574] text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">5</span>
                <span>Klart! Din månatliga donation är nu aktiv 🎉</span>
              </li>
            </ol>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Viktigt:</strong> Din donation aktiveras INTE förrän du har signerat med BankID via emailet från Billecta.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              Fick du inte emailet inom 5 minuter?
              <br />
              Kontakta oss på{" "}
              <a href="mailto:info@alrahmamoske.se" className="text-[#d4a574] hover:underline font-semibold">
                info@alrahmamoske.se
              </a>{" "}
              eller{" "}
              <a href="tel:+46737739772" className="text-[#d4a574] hover:underline font-semibold">
                +46 73 773 97 72
              </a>
            </p>
          </div>

          {/* Back Button */}
          <a href="/" className="inline-block bg-[#1e3a5f] hover:bg-[#2c5079] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
            Tillbaka till startsidan
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#d4a574] border-t-transparent mx-auto mb-4"></div>
            <p className="text-[#1e3a5f] text-lg">Laddar...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
// Updated
