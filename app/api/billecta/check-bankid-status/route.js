// app/api/billecta/check-bankid-status/route.js
// TEMP DEBUG VERSION - log full raw response to see what Billecta actually returns
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
    const { referenceToken } = await request.json();

    const response = await fetch(`${BILLECTA_CONFIG.baseUrl}/v1/bankid/sign/${referenceToken}`, {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
        Accept: "application/json",
      },
    });

    const raw = await response.text();

    if (!response.ok) {
      throw new Error(`Status check failed: ${raw}`);
    }

    const data = JSON.parse(raw);

    // Log every field
    console.log("[BANKID FIELDS]", {
      Status: data.Status,
      HintCode: data.HintCode,
      GivenName: data.GivenName,
      Surname: data.Surname,
      NotAfter: data.NotAfter,
      Signature: data.Signature ? "present" : null,
      OcspResponse: data.OcspResponse ? "present" : null,
    });

    // Map all possible Billecta statuses
    let frontendStatus;
    switch (data.Status) {
      case "Complete":
        frontendStatus = "Success";
        break;
      case "Failed":
      case "Expired":
        frontendStatus = data.Status;
        break;
      case "Started":
      case "Pending":
      default:
        frontendStatus = "Pending";
        break;
    }

    return NextResponse.json({
      success: true,
      status: frontendStatus,
      rawStatus: data.Status, // ← send raw status to frontend too
      hintCode: data.HintCode,
      qrCodeData: data.QR,
    });
  } catch (error) {
    console.error("\n[BANKID STATUS ERROR]", error.message);
    return NextResponse.json({ error: "Kunde inte kontrollera BankID-status" }, { status: 500 });
  }
}
