// app/api/billecta/initiate-bankid/route.js
// Initiates BankID signing for Autogiro approval

import { NextResponse } from "next/server";

const BILLECTA_CONFIG = {
  baseUrl: process.env.NODE_ENV === "production" ? "https://api.billecta.com" : "https://apitest.billecta.com",
  username: process.env.BILLECTA_USERNAME,
  password: process.env.BILLECTA_PASSWORD,
};

function getAuthHeader() {
  const credentials = Buffer.from(`${BILLECTA_CONFIG.username}:${BILLECTA_CONFIG.password}`).toString("base64");
  return `Basic ${credentials}`;
}

export async function POST(request) {
  try {
    const { contractInvoiceId, personalNumber } = await request.json();

    console.log("\n[BANKID] Initiating BankID signing...");
    console.log("  Contract Invoice ID:", contractInvoiceId);
    console.log("  Personal Number:", personalNumber);

    // Initiate BankID signing via Billecta API
    const response = await fetch(`${BILLECTA_CONFIG.baseUrl}/v1/bankid/sign`, {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        PersonalNumber: personalNumber,
        EndUserIp: "127.0.0.1", // In production, get real IP
        UserVisibleData: Buffer.from(`Jag godkänner autogiro för avtalsfaktura ${contractInvoiceId}`).toString("base64"),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("  ✗ BankID initiation failed:", response.status);
      console.log("  Error:", errorText);
      throw new Error(`BankID initiation failed: ${errorText}`);
    }

    const data = await response.json();
    console.log("  ✓ BankID initiated successfully");
    console.log("  Reference Token:", data.ReferenceToken);

    return NextResponse.json({
      success: true,
      referenceToken: data.ReferenceToken,
      autoStartToken: data.AutoStartToken,
      qrCodeData: data.QrCodeData,
    });
  } catch (error) {
    console.error("\n[BANKID ERROR]", error.message);
    return NextResponse.json({ error: "Kunde inte starta BankID-signering" }, { status: 500 });
  }
}
