// // app/api/billecta/get-contract/route.js
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
//     const { personalNumber, bankIdReferenceToken } = await request.json();

//     if (!personalNumber || !bankIdReferenceToken) {
//       return NextResponse.json({ error: "Saknar personnummer eller BankID-token" }, { status: 400 });
//     }

//     // 1. Verify BankID is Complete
//     const statusRes = await fetch(`${BILLECTA_CONFIG.baseUrl}/v1/bankid/sign/${bankIdReferenceToken}`, {
//       headers: { Authorization: getAuthHeader(), Accept: "application/json" },
//     });
//     const statusData = await statusRes.json();
//     if (statusData.Status !== "Complete") {
//       return NextResponse.json({ error: "BankID-verifiering misslyckades" }, { status: 403 });
//     }

//     // 2. Look up debtor by SSN
//     const debtorRes = await fetch(`${BILLECTA_CONFIG.baseUrl}/v1/debtors/debtorsbyorgno/${BILLECTA_CONFIG.creditorId}?orgno=${personalNumber}&countrycode=SE`, { headers: { Authorization: getAuthHeader(), Accept: "application/json" } });

//     if (!debtorRes.ok) {
//       return NextResponse.json({ error: "Inget konto hittades för detta personnummer" }, { status: 404 });
//     }

//     const debtorData = await debtorRes.json();
//     const debtor = Array.isArray(debtorData) ? debtorData[0] : debtorData;
//     const debtorId = debtor?.DebtorPublicId;

//     if (!debtorId) {
//       return NextResponse.json({ error: "Inget aktivt avtal hittades" }, { status: 404 });
//     }

//     // 3. TODO: fetch contract once correct endpoint is known
//     // Placeholder — returns debtor info so manage page at least loads
//     return NextResponse.json({
//       success: true,
//       contract: {
//         id: null, // unknown until correct endpoint found
//         amount: null,
//         status: "Active",
//         nextPayment: null,
//         created: debtor.Created,
//         debtorName: debtor.Name,
//         debtorId,
//       },
//     });
//   } catch (error) {
//     console.error("[GET-CONTRACT ERROR]", error.message);
//     return NextResponse.json({ error: "Något gick fel: " + error.message }, { status: 500 });
//   }
// }
