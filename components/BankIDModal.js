// components/BankIDModal.js
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function BankIDModal({ contractInvoiceId, personalNumber, onSuccess, onClose }) {
  const [status, setStatus] = useState("initiating"); // initiating, pending, success, error
  const [qrCode, setQrCode] = useState(null);
  const [autoStartToken, setAutoStartToken] = useState(null);
  const [referenceToken, setReferenceToken] = useState(null);
  const [message, setMessage] = useState("Startar BankID...");
  const [attempts, setAttempts] = useState(0);

  // Max 2 minutes (120 seconds = 120 attempts at 1 second intervals)
  const MAX_ATTEMPTS = 120;

  function updatePendingMessage(hintCode) {
    const messages = {
      outstandingTransaction: "Väntar på att du ska öppna BankID...",
      noClient: "BankID-appen kunde inte hittas",
      started: "Öppnar BankID...",
      userSign: "Skriv in din säkerhetskod i BankID",
    };

    setMessage(messages[hintCode] || "Väntar på signering...");
  }

  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Fix 1: Use useCallback to memoize initiateBankID
  const initiateBankID = useCallback(async () => {
    try {
      const res = await fetch("/api/billecta/initiate-bankid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractInvoiceId,
          personalNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Kunde inte starta BankID");
      }

      setReferenceToken(data.referenceToken);
      setQrCode(data.qrCodeData);
      setAutoStartToken(data.autoStartToken);
      setStatus("pending");
      setMessage("Öppna BankID-appen på din telefon");

      // Auto-launch BankID app on mobile
      if (isMobile() && data.autoStartToken) {
        window.location.href = `bankid:///?autostarttoken=${data.autoStartToken}&redirect=null`;
      }
    } catch (error) {
      console.error("BankID initiation error:", error);
      setStatus("error");
      setMessage(error.message);
    }
  }, [contractInvoiceId, personalNumber]);

  // Fix 2: Use useCallback to memoize checkStatus
  const checkStatus = useCallback(async () => {
    if (attempts >= MAX_ATTEMPTS) {
      setStatus("error");
      setMessage("Tiden gick ut. Vänligen försök igen.");
      return;
    }

    setAttempts((prev) => prev + 1);

    try {
      const res = await fetch("/api/billecta/check-bankid-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Kunde inte kontrollera status");
      }

      // Handle different statuses
      switch (data.status) {
        case "Success":
          setStatus("success");
          setMessage("Signering genomförd! Omdirigerar...");
          setTimeout(() => onSuccess(), 1500);
          break;

        case "Failed":
        case "Expired":
          setStatus("error");
          setMessage("Signering misslyckades. Vänligen försök igen.");
          break;

        case "Pending":
          // Update message based on hint code
          updatePendingMessage(data.hintCode);
          break;

        default:
          console.log("Unknown status:", data.status);
      }
    } catch (error) {
      console.error("Status check error:", error);
      setStatus("error");
      setMessage(error.message);
    }
  }, [attempts, MAX_ATTEMPTS, referenceToken, onSuccess]);

  // Step 1: Initiate BankID signing
  useEffect(() => {
    initiateBankID();
  }, [initiateBankID]);

  // Step 2: Poll for status
  useEffect(() => {
    if (status === "pending" && referenceToken) {
      const interval = setInterval(() => {
        checkStatus();
      }, 1000); // Poll every second

      return () => clearInterval(interval);
    }
  }, [status, referenceToken, checkStatus]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">BankID-signering</h2>
          <p className="text-gray-600 mt-2">Avtalsfaktura #{contractInvoiceId}</p>
        </div>

        {/* Status Icon */}
        <div className="flex justify-center mb-6">
          {status === "initiating" && <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent"></div>}

          {status === "pending" && (
            <div className="animate-pulse">
              <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
          )}

          {status === "success" && (
            <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}

          {status === "error" && (
            <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Message */}
        <p className="text-center text-gray-700 mb-6 min-h-[50px]">{message}</p>

        {/* QR Code (Desktop only) - Fix 3: Use Next.js Image component */}
        {status === "pending" && qrCode && !isMobile() && (
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 text-center mb-3">Skanna QR-koden med BankID-appen</p>
            <div className="flex justify-center">
              <Image
                src={`data:image/png;base64,${qrCode}`}
                alt="QR Code"
                width={192}
                height={192}
                className="w-48 h-48"
                unoptimized // Required for base64 data URLs
              />
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {status === "pending" && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${(attempts / MAX_ATTEMPTS) * 100}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              {Math.floor((MAX_ATTEMPTS - attempts) / 60)} min {(MAX_ATTEMPTS - attempts) % 60} sek kvar
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {status === "error" && (
            <button onClick={() => window.location.reload()} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Försök igen
            </button>
          )}

          {status !== "success" && (
            <button onClick={onClose} className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
              Avbryt
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
