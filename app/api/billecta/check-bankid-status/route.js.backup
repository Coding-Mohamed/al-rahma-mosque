// app/api/billecta/check-bankid-status/route.js
// Polls BankID signing status

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
    const { referenceToken } = await request.json();

    console.log("\n[BANKID] Checking status...");
    console.log("  Reference Token:", referenceToken);

    // Check BankID status via Billecta API
    const response = await fetch(`${BILLECTA_CONFIG.baseUrl}/v1/bankid/sign/${referenceToken}`, {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("  ✗ Status check failed:", response.status);
      throw new Error(`Status check failed: ${errorText}`);
    }

    const data = await response.json();
    console.log("  Status:", data.Status);

    return NextResponse.json({
      success: true,
      status: data.Status,
      hintCode: data.HintCode,
    });
  } catch (error) {
    console.error("\n[BANKID STATUS ERROR]", error.message);
    return NextResponse.json({ error: "Kunde inte kontrollera BankID-status" }, { status: 500 });
  }
}
