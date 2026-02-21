// // app/api/billecta/update-contract/route.js
// import { NextResponse } from "next/server";

// const BILLECTA_CONFIG = {
//   baseUrl: "https://apitest.billecta.com",
//   username: process.env.BILLECTA_USERNAME,
//   password: process.env.BILLECTA_PASSWORD,
//   creditorId: process.env.BILLECTA_CREDITOR_ID,
//   monthlyProductId: process.env.BILLECTA_MONTHLY_PRODUCT_ID,
// };

// function getAuthHeader() {
//   const credentials = Buffer.from(`${BILLECTA_CONFIG.username}:${BILLECTA_CONFIG.password}`).toString("base64");
//   return `Basic ${credentials}`;
// }

// export async function POST(request) {
//   try {
//     const { contractId, debtorId, newAmount, bankIdReferenceToken } = await request.json();

//     if (!contractId || !debtorId || !newAmount || !bankIdReferenceToken) {
//       return NextResponse.json({ error: "Saknar nödvändig information" }, { status: 400 });
//     }

//     if (newAmount < 50) {
//       return NextResponse.json({ error: "Beloppet måste vara minst 50 kr" }, { status: 400 });
//     }

//     // 1. Verify BankID
//     const statusRes = await fetch(`${BILLECTA_CONFIG.baseUrl}/v1/bankid/sign/${bankIdReferenceToken}`, {
//       headers: { Authorization: getAuthHeader(), Accept: "application/json" },
//     });
//     const statusData = await statusRes.json();
//     if (statusData.Status !== "Complete") {
//       return NextResponse.json({ error: "BankID-verifiering misslyckades" }, { status: 403 });
//     }

//     // 2. Cancel old contract
//     const cancelRes = await fetch(`${BILLECTA_CONFIG.baseUrl}/v1/contractinvoice/action`, {
//       method: "PUT",
//       headers: { Authorization: getAuthHeader(), "Content-Type": "application/json" },
//       body: JSON.stringify({
//         Action: "Cancel",
//         ContractInvoicePublicId: contractId,
//         CreditorPublicId: BILLECTA_CONFIG.creditorId,
//       }),
//     });

//     if (!cancelRes.ok) {
//       return NextResponse.json({ error: "Kunde inte uppdatera avtalet" }, { status: 500 });
//     }

//     // 3. Create new contract with updated amount
//     const createRes = await fetch(`${BILLECTA_CONFIG.baseUrl}/v1/contractinvoice/action`, {
//       method: "POST",
//       headers: { Authorization: getAuthHeader(), "Content-Type": "application/json" },
//       body: JSON.stringify({
//         CreditorPublicId: BILLECTA_CONFIG.creditorId,
//         DebtorPublicId: debtorId,
//         ContractInvoiceRows: [
//           {
//             ProductPublicId: BILLECTA_CONFIG.monthlyProductId,
//             NumberOfItems: 1,
//             UnitPrice: { Value: newAmount, CurrencyCode: "SEK" },
//           },
//         ],
//         AutogiroPaymentSettings: {
//           IsEnabled: true,
//           DayOfMonth: 27,
//         },
//       }),
//     });

//     if (!createRes.ok) {
//       const err = await createRes.text();
//       console.error("[UPDATE CREATE ERROR]", err);
//       return NextResponse.json({ error: "Gammalt avtal avslutades men nytt kunde inte skapas — kontakta moskén" }, { status: 500 });
//     }

//     const createData = await createRes.json();
//     const newContractId = createData?.ActionPublicId || createData?.ContractInvoicePublicId;

//     console.log("[UPDATE] Old cancelled, new contract:", newContractId, "Amount:", newAmount);
//     return NextResponse.json({ success: true, newContractId, newAmount });
//   } catch (error) {
//     console.error("[UPDATE-CONTRACT ERROR]", error.message);
//     return NextResponse.json({ error: "Något gick fel" }, { status: 500 });
//   }
// }
