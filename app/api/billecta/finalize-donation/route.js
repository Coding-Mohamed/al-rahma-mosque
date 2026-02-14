// app/api/billecta/finalize-donation/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  const { debtorId, amount } = await req.json();

  const contractData = {
    CreditorPublicId: process.env.BILLECTA_CREDITOR_ID,
    DebtorPublicId: debtorId,
    CurrencyCode: "SEK",
    InvoiceRows: [
      {
        ProductPublicId: process.env.BILLECTA_PRODUCT_ID,
        Quantity: 1,
        UnitPrice: { Value: parseFloat(amount), CurrencyCode: "SEK" },
      },
    ],
    RecurrenceDetails: {
      RecurrenceInterval: "Monthly",
      Start: new Date().toISOString().split("T")[0],
      NoEndDate: true,
      MonthlyRecurrence: { RecurOnDayInMonth: 27, RecurMonthInterval: 1 },
    },
    Autogiro: { AutogiroWithdrawalEnabled: true },
    AutoAttestEnabled: true,
  };

  const res = await fetch(`${process.env.BILLECTA_URL}/v1/contractinvoice/action`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(process.env.BILLECTA_AUTH).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contractData),
  });

  if (!res.ok) return NextResponse.json({ error: "Failed" }, { status: 500 });
  return NextResponse.json({ success: true });
}
