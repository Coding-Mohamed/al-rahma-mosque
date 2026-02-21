"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");

  return (
    <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center py-16 px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-10 text-center border-t-4 border-[#d4a574]">
        {/* Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-3">Välkommen som månadsgivare!</h1>
        <p className="text-gray-500 mb-8">Din autogiroanmälan är signerad och bekräftad med BankID.</p>

        {/* Amount */}
        {amount && (
          <div className="bg-[#f5f1e8] rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Månadsbelopp</p>
            <p className="text-4xl font-bold text-[#1e3a5f]">
              {amount} <span className="text-xl font-normal text-gray-500">kr/mån</span>
            </p>
            <p className="text-sm text-gray-400 mt-2">Första uttag sker den 27:e nästa månad</p>
          </div>
        )}

        {/* What happens next — simple, no email instructions */}
        <div className="bg-blue-50 rounded-xl p-5 mb-8 text-left">
          <h2 className="font-semibold text-[#1e3a5f] mb-3">Vad händer nu?</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              Autogiroanmälan är registrerad och signerad
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              Pengarna dras automatiskt varje månad
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              Du kan när som helst ändra eller avsluta din donation
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {/* <a href="/donations/manage" className="block w-full bg-[#1e3a5f] text-white py-3 rounded-xl font-semibold hover:bg-[#2c5079] transition">
            Hantera min donation
          </a> */}
          <a href="/" className="block w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
            Tillbaka till startsidan
          </a>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Frågor? Kontakta oss på{" "}
          <a href="mailto:info@alrahmamoske.se" className="text-[#d4a574] hover:underline">
            info@alrahmamoske.se
          </a>
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#d4a574] border-t-transparent" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
