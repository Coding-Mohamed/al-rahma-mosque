// // app/api/billecta/initiate-bankid/route.js

import { NextResponse } from "next/server";

const BILLECTA_CONFIG = {
  baseUrl: "https://apitest.billecta.com",
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

    const requestBody = {
      CreditorPublicId: process.env.BILLECTA_CREDITOR_ID,
      SSN: personalNumber, // ✅ was PersonalNumber
      UserMessage: `Jag godkanner autogiro for avtalsfaktura ${contractInvoiceId}`, // ✅ was UserVisibleData + base64
      UserNonVisibleData: null,
      ReturnUrl: null,
    };

    console.log("\n[BANKID] Initiating BankID signing...");
    console.log("  Contract Invoice ID:", contractInvoiceId);
    console.log("  SSN:", personalNumber);

    const response = await fetch(`${BILLECTA_CONFIG.baseUrl}/v1/bankid/sign`, {
      method: "PUT",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.log("  ✗ BankID initiation failed:", response.status, responseText);
      throw new Error(`BankID initiation failed: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log("  ✓ BankID initiated, ReferenceToken:", data.ReferenceToken);

    return NextResponse.json({
      success: true,
      referenceToken: data.ReferenceToken,
      autoStartToken: data.AutoStartToken,
      qrCodeData: data.QR, // ✅ was data.QrCodeData, and it's a full data URL
    });
  } catch (error) {
    console.error("\n[BANKID ERROR]", error.message);
    return NextResponse.json({ error: "Kunde inte starta BankID-signering" }, { status: 500 });
  }
}
