// app/donations/success/page.jsx
"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-lighter flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          {/* Success Icon */}
          <div className="text-6xl mb-6 animate-bounce">✅</div>

          {/* Main Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Tack för din donation!</h1>
          <p className="text-lg text-gray-700 mb-8">Din månatliga donation är nu aktiv.</p>

          {/* Info Box */}
          <div className="bg-lighter rounded-xl p-6 mb-8 text-left">
            <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
              <span>📋</span>
              <span>Vad händer nu?</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-accent">✓</span>
                <span>Du får ett kvitto via email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">✓</span>
                <span>Du debiteras automatiskt varje månad</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">✓</span>
                <span>Du kan ändra belopp eller avsluta när som helst</span>
              </li>
            </ul>
          </div>

          {/* Session ID (for reference) */}
          {sessionId && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Referensnummer:</p>
              <p className="text-xs font-mono text-gray-700 break-all">{sessionId}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href="/" className="block w-full bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-accent transition">
              Tillbaka till startsidan
            </Link>

            <Link href="/donations/manage" className="block w-full bg-gray-200 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-300 transition">
              Hantera min prenumeration
            </Link>
          </div>

          {/* Thank You Message */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-sm">🤲 Må Allah belöna dig för ditt stöd till Al-Rahma Moské</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Frågor? Kontakta oss på info@alrahmamoske.se</p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-lighter flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Laddar...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
