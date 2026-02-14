// // app/donations/success/page.jsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function DonationSuccessPage() {
  const searchParams = useSearchParams();
  const contractId = searchParams.get("contractId");
  const amount = searchParams.get("amount");

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Donation Skapad!</h1>
            <p className="text-gray-600">Tack för ditt stöd till Al-Rahma Moskée</p>
          </div>

          {/* Contract Info */}
          {contractId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Belopp per månad</p>
                  <p className="font-semibold text-gray-900">{amount} kr</p>
                </div>
                <div>
                  <p className="text-gray-600">Avtalsnummer</p>
                  <p className="font-semibold text-gray-900">{contractId}</p>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Nästa steg: Signera med BankID
            </h2>
            <ol className="space-y-3 text-blue-800">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                <div>
                  <p className="font-semibold">Kolla din email</p>
                  <p className="text-sm text-blue-700">Du får ett email från Billecta inom några minuter</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                <div>
                  <p className="font-semibold">Klicka på länken i emailet</p>
                  <p className="text-sm text-blue-700">Du kommer till Billectas säkra signeringssida</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                <div>
                  <p className="font-semibold">Signera med BankID</p>
                  <p className="text-sm text-blue-700">Använd din BankID-app för att godkänna autogiro</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">✓</span>
                <div>
                  <p className="font-semibold">Klart!</p>
                  <p className="text-sm text-blue-700">Din månatliga donation är aktiverad</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Warning about spam */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Kom ihåg att kolla spam-mappen!</p>
                <p className="text-yellow-700">Ibland hamnar emailet från Billecta i spam. Kolla där om du inte ser något inom 5 minuter.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link href="/donations" className="flex-1 text-center bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition">
              Skapa En Till
            </Link>
            <Link href="/" className="flex-1 text-center bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition">
              Tillbaka Hem
            </Link>
          </div>

          {/* Footer */}
          <p className="mt-6 text-xs text-center text-gray-500">Vid frågor, kontakta Al-Rahma Moskée</p>
        </div>
      </div>
    </div>
  );
}
