// // app/api/billecta/cancel-contract/route.js
// import { NextResponse } from "next/server";

// const BILLECTA_CONFIG = {
//   baseUrl: "https://apitest.billecta.com",
//   username: process.env.BILLECTA_USERNAME,
//   password: process.env.BILLECTA_PASSWORD,
//   creditorId: process.env.BILLECTA_CREDITOR_ID,
// };

// function getAuthHeader() {
//   const credentials = Buffer.from(`${BILLECTA_CONFIG.username}:${BILLECTA_CONFIG.password}`).toString("base64");
//   return `Basic ${credentials}`;
// }

// export async function POST(request) {
//   try {
//     const { contractId, bankIdReferenceToken } = await request.json();

//     if (!contractId || !bankIdReferenceToken) {
//       return NextResponse.json({ error: "Saknar avtalsnummer eller BankID-token" }, { status: 400 });
//     }

//     // 1. Verify BankID
//     const statusRes = await fetch(`${BILLECTA_CONFIG.baseUrl}/v1/bankid/sign/${bankIdReferenceToken}`, {
//       headers: { Authorization: getAuthHeader(), Accept: "application/json" },
//     });
//     const statusData = await statusRes.json();
//     if (statusData.Status !== "Complete") {
//       return NextResponse.json({ error: "BankID-verifiering misslyckades" }, { status: 403 });
//     }

//     // 2. Cancel contract
//     const cancelRes = await fetch(`${BILLECTA_CONFIG.baseUrl}/v1/contractinvoice/action`, {
//       method: "PUT",
//       headers: {
//         Authorization: getAuthHeader(),
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: JSON.stringify({
//         Action: "Cancel",
//         ContractInvoicePublicId: contractId,
//         CreditorPublicId: BILLECTA_CONFIG.creditorId,
//       }),
//     });

//     if (!cancelRes.ok) {
//       const err = await cancelRes.text();
//       console.error("[CANCEL ERROR]", err);
//       return NextResponse.json({ error: "Kunde inte avsluta avtalet" }, { status: 500 });
//     }

//     console.log("[CANCEL] Contract cancelled:", contractId);
//     return NextResponse.json({ success: true, message: "Avtalet har avslutats" });
//   } catch (error) {
//     console.error("[CANCEL-CONTRACT ERROR]", error.message);
//     return NextResponse.json({ error: "Något gick fel" }, { status: 500 });
//   }
// }
