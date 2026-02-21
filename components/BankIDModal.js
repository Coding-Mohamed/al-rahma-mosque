// // components/BankIDModal.js

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

export default function BankIDModal({ contractInvoiceId, personalNumber, onSuccess, onClose }) {
  const [deviceChoice, setDeviceChoice] = useState(null);
  const [status, setStatus] = useState("initiating");
  const [qrCode, setQrCode] = useState(null);
  const [referenceToken, setReferenceToken] = useState(null);
  const [message, setMessage] = useState("Startar BankID...");
  const [attempts, setAttempts] = useState(0);
  const attemptsRef = useRef(0);
  const intervalRef = useRef(null);
  const MAX_ATTEMPTS = 60;
  const POLL_INTERVAL = 2000;

  function stopPolling() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

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

  const initiateBankID = useCallback(async () => {
    try {
      const res = await fetch("/api/billecta/initiate-bankid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractInvoiceId, personalNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kunde inte starta BankID");

      setReferenceToken(data.referenceToken);
      setQrCode(data.qrCodeData);
      setStatus("pending");

      if (deviceChoice === "same" && data.autoStartToken) {
        setMessage("Öppnar BankID-appen...");
        window.location.href = `bankid:///?autostarttoken=${data.autoStartToken}&redirect=null`;
      } else {
        setMessage("Skanna QR-koden med BankID-appen");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }, [contractInvoiceId, personalNumber, deviceChoice]);

  const checkStatus = useCallback(async () => {
    if (attemptsRef.current >= MAX_ATTEMPTS) {
      stopPolling();
      setStatus("error");
      setMessage("Tiden gick ut. Vänligen försök igen.");
      return;
    }

    attemptsRef.current += 1;
    setAttempts(attemptsRef.current);

    try {
      const res = await fetch("/api/billecta/check-bankid-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceToken }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Ogiltigt svar från servern");
      }

      if (!res.ok) throw new Error(data?.error || "Kunde inte kontrollera status");

      console.log("BANKID STATUS:", data.rawStatus, "→", data.status, "| hint:", data.hintCode);

      switch (data.status) {
        case "Success":
          stopPolling();
          setStatus("success");
          setMessage("Signering genomförd! Skapar ditt avtal...");
          setTimeout(() => onSuccess(referenceToken), 1500);
          break;
        case "Failed":
        case "Expired":
          stopPolling();
          setStatus("error");
          setMessage("Signering misslyckades. Vänligen försök igen.");
          break;
        case "Pending":
          updatePendingMessage(data.hintCode);
          if (data.qrCodeData) setQrCode(data.qrCodeData);
          break;
        default:
          console.log("UNHANDLED STATUS:", data.status, "raw:", data.rawStatus);
          break;
      }
    } catch (error) {
      console.error("checkStatus error:", error.message);
      stopPolling();
      setStatus("error");
      setMessage(error.message);
    }
  }, [referenceToken, onSuccess]);

  // ✅ Step 1: Start BankID after device choice
  useEffect(() => {
    if (deviceChoice) {
      attemptsRef.current = 0;
      setAttempts(0);
      setStatus("initiating");
      initiateBankID();
    }
  }, [deviceChoice, initiateBankID]);

  // ✅ Step 2: Poll every 2 seconds once pending
  useEffect(() => {
    if (status === "pending" && referenceToken) {
      intervalRef.current = setInterval(checkStatus, POLL_INTERVAL);
      return () => stopPolling();
    }
  }, [status, referenceToken, checkStatus]);

  // ── Screen 1: Choose device ───────────────────────────────────────────────
  if (!deviceChoice) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">BankID-signering</h2>
            <p className="text-gray-500 mt-1 text-sm">Godkänn ditt autogiro med BankID</p>
          </div>
          <p className="text-gray-600 text-center mb-5">Hur vill du signera med BankID?</p>
          <div className="space-y-3">
            <button onClick={() => setDeviceChoice("same")} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              BankID på den här enheten
            </button>
            <button onClick={() => setDeviceChoice("other")} className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              BankID på annan enhet (QR-kod)
            </button>
          </div>
          <button onClick={onClose} className="w-full mt-4 text-gray-400 hover:text-gray-600 text-sm py-2 transition">
            Avbryt
          </button>
        </div>
      </div>
    );
  }

  // ── Screen 2: Signing flow ────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">BankID-signering</h2>
          <p className="text-gray-500 mt-1 text-sm">Godkänn ditt autogiro med BankID</p>
        </div>

        <div className="flex justify-center mb-6">
          {status === "initiating" && <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent" />}
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

        <p className="text-center text-gray-700 mb-6 min-h-[50px]">{message}</p>

        {status === "pending" && qrCode && deviceChoice === "other" && (
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 text-center mb-3">Skanna QR-koden med BankID-appen</p>
            <div className="flex justify-center">
              <Image src={qrCode} alt="QR Code" width={192} height={192} className="w-48 h-48" unoptimized />
            </div>
          </div>
        )}

        {status === "pending" && deviceChoice === "same" && <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg mb-6 text-center text-sm text-blue-700">Öppna BankID-appen och godkänn signeringen</div>}

        {status === "pending" && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${(attempts / MAX_ATTEMPTS) * 100}%` }} />
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              {Math.floor(((MAX_ATTEMPTS - attempts) * POLL_INTERVAL) / 1000 / 60)} min {Math.floor(((MAX_ATTEMPTS - attempts) * POLL_INTERVAL) / 1000) % 60} sek kvar
            </p>
          </div>
        )}

        <div className="space-y-3">
          {status === "error" && (
            <button
              onClick={() => {
                stopPolling();
                setDeviceChoice(null);
                setStatus("initiating");
                attemptsRef.current = 0;
                setAttempts(0);
                setReferenceToken(null);
                setQrCode(null);
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Försök igen
            </button>
          )}
          {status !== "success" && (
            <button
              onClick={() => {
                stopPolling();
                onClose();
              }}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Avbryt
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
