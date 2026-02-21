// app/api/billecta/create-monthly-donation/route.js
// NOW ONLY creates debtor + contract invoice AFTER bankid success

import { NextResponse } from "next/server";

const BILLECTA_CONFIG = {
  baseUrl: "https://apitest.billecta.com",
  username: process.env.BILLECTA_USERNAME,
  password: process.env.BILLECTA_PASSWORD,
  creditorPublicId: process.env.BILLECTA_CREDITOR_ID,
  monthlyDonationProductId: process.env.BILLECTA_MONTHLY_PRODUCT_ID,
};

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const MAX_REQUESTS = 10;

function checkRateLimit(identifier) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(identifier) || [];
  const validRequests = userRequests.filter((time) => now - time < RATE_LIMIT_WINDOW);
  if (validRequests.length >= MAX_REQUESTS) return false;
  validRequests.push(now);
  rateLimitMap.set(identifier, validRequests);
  return true;
}

function maskPersonalNumber(pnr) {
  if (!pnr) return "******-****";
  return pnr.replace(/(\d{6})\d{2}-?\d{4}/, "$1**-****");
}

function maskEmail(email) {
  if (!email) return "***@***";
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***@***";
  if (local.length <= 2) return `**@${domain}`;
  return `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
}

function validateInput(body) {
  const errors = [];
  const amount = parseInt(body.amount);
  if (isNaN(amount) || amount < 50 || amount > 100000) errors.push("Beloppet måste vara mellan 50 och 100,000 kr");
  if (!body.name || body.name.length < 2 || body.name.length > 100) errors.push("Namnet måste vara mellan 2 och 100 tecken");
  if (!/^[a-zA-ZåäöÅÄÖ\s\-']+$/.test(body.name)) errors.push("Namnet får endast innehålla bokstäver");
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errors.push("Ogiltig e-postadress");
  if (!body.personalNumber || !/^\d{6,8}-?\d{4}$/.test(body.personalNumber)) errors.push("Ogiltigt personnummer format");
  // ✅ NEW: Require verified bankID reference token
  if (!body.bankIdReferenceToken) errors.push("BankID-signering saknas");
  return { valid: errors.length === 0, errors };
}

function sanitize(input) {
  if (typeof input !== "string") return input;
  return input.trim().replace(/[<>]/g, "").slice(0, 200);
}

function getAuthHeader() {
  const credentials = Buffer.from(`${BILLECTA_CONFIG.username}:${BILLECTA_CONFIG.password}`).toString("base64");
  return `Basic ${credentials}`;
}

async function billectaRequest(endpoint, method = "GET", data = null) {
  const url = `${BILLECTA_CONFIG.baseUrl}${endpoint}`;
  console.log(`\n→ ${method} ${endpoint}`);
  const options = {
    method,
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  if (data && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(data);
  }
  const response = await fetch(url, options);
  let responseData = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }
  if (!response.ok) {
    console.log("  ✗ FAILED:", response.status);
    throw new Error(`Billecta API error (${response.status})`);
  }
  console.log("  ✓ SUCCESS:", response.status);
  return responseData;
}

// ✅ NEW: Verify BankID signing was actually completed before creating member
async function verifyBankIDSigned(referenceToken) {
  const response = await fetch(`${BILLECTA_CONFIG.baseUrl}/v1/bankid/sign/${referenceToken}`, {
    method: "GET",
    headers: {
      Authorization: getAuthHeader(),
      Accept: "application/json",
    },
  });
  if (!response.ok) throw new Error("Could not verify BankID status");
  const data = await response.json();
  console.log("  BankID status verification:", data.Status);
  if (data.Status !== "Complete") {
    throw new Error("BankID signing not completed");
  }
  return true;
}

export async function POST(request) {
  try {
    console.log("\n" + "=".repeat(60));
    console.log("NEW AUTOGIRO DONATION REQUEST (POST BANKID)");
    console.log("=".repeat(60));

    const clientId = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(clientId)) {
      return NextResponse.json({ error: "För många försök. Försök igen om 15 minuter." }, { status: 429 });
    }

    const body = await request.json();
    const validation = validateInput(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors[0] }, { status: 400 });
    }

    console.log("\n[1] PARSE REQUEST");
    console.log("  Amount:", body.amount, "kr");
    console.log("  Name:", body.name);
    console.log("  Email:", maskEmail(body.email));
    console.log("  Personal Number:", maskPersonalNumber(body.personalNumber));
    console.log("  BankID Token:", body.bankIdReferenceToken);

    const amount = parseInt(body.amount);
    const email = sanitize(body.email);
    const name = sanitize(body.name);
    const personalNumber = sanitize(body.personalNumber);
    const bankIdReferenceToken = sanitize(body.bankIdReferenceToken);

    // ✅ STEP 1: Verify BankID was actually signed — gate everything behind this
    console.log("\n[2] VERIFY BANKID SIGNING");
    try {
      await verifyBankIDSigned(bankIdReferenceToken);
      console.log("  ✓ BankID verified — proceeding with member creation");
    } catch (error) {
      console.log("  ✗ BankID verification failed:", error.message);
      return NextResponse.json({ error: "BankID-signeringen kunde inte verifieras. Vänligen försök igen." }, { status: 403 });
    }

    // STEP 2: Create/update debtor
    console.log("\n[3] CREATE/UPDATE DEBTOR");
    let debtorPublicId;
    try {
      const existing = await billectaRequest(`/v1/debtors/debtorsbyorgno/${BILLECTA_CONFIG.creditorPublicId}?orgno=${personalNumber}&countrycode=SE`);
      if (existing?.length > 0) {
        debtorPublicId = existing[0].DebtorPublicId;
        await billectaRequest("/v1/debtors/debtor", "PUT", {
          DebtorPublicId: debtorPublicId,
          CreditorPublicId: BILLECTA_CONFIG.creditorPublicId,
          Name: name,
          Email: email,
          OrgNo: personalNumber,
          CountryCode: "SE",
        });
        console.log("  ✓ Debtor updated:", debtorPublicId);
      } else {
        const createResponse = await billectaRequest("/v1/debtors/debtor", "POST", {
          CreditorPublicId: BILLECTA_CONFIG.creditorPublicId,
          Name: name,
          Email: email,
          OrgNo: personalNumber,
          CountryCode: "SE",
          IsActive: true,
        });
        debtorPublicId = createResponse.PublicId;
        console.log("  ✓ Debtor created:", debtorPublicId);
      }
    } catch (error) {
      console.log("  ✗ Debtor error:", error.message);
      return NextResponse.json({ error: "Ett tekniskt fel uppstod. Vänligen försök igen." }, { status: 500 });
    }

    // STEP 3: Create contract invoice
    console.log("\n[4] CREATE CONTRACT INVOICE");
    try {
      const today = new Date();
      const startDate = today.toISOString().split("T")[0];
      const amountInOre = amount * 100;

      const contractInvoice = await billectaRequest("/v1/contractinvoice/action", "POST", {
        CreditorPublicId: BILLECTA_CONFIG.creditorPublicId,
        DebtorPublicId: debtorPublicId,
        Records: [
          {
            ProductPublicId: BILLECTA_CONFIG.monthlyDonationProductId,
            ArticleDescription: `Månatlig donation ${amount} kr`,
            Quantity: 1,
            UnitPrice: { Value: amountInOre, CurrencyCode: "SEK" },
            VATPercent: 0,
          },
        ],
        RecurrenceDetails: {
          RecurrenceInterval: "Monthly",
          Start: startDate,
          NoEndDate: true,
          End: null,
          MonthlyRecurrence: { RecurOnDayInMonth: 1, RecurMonthInterval: 1 },
        },
        Autogiro: { AutogiroWithdrawalEnabled: true },
        AutoAttestEnabled: true,
        DeliveryMethod: "Email",
        PaymentTermsInDays: 30,
        CurrencyCode: "SEK",
      });

      console.log("  ✓ Contract Invoice created:", contractInvoice.PublicId);
      return NextResponse.json({
        success: true,
        contractInvoiceId: contractInvoice.PublicId,
        debtorId: debtorPublicId,
        amount,
        startDate,
        message: "Välkommen som månadsgivare!",
      });
    } catch (error) {
      console.log("  ✗ Contract Invoice failed:", error.message);
      return NextResponse.json({ error: "Ett tekniskt fel uppstod. Vänligen försök igen." }, { status: 500 });
    }
  } catch (error) {
    console.log("✗✗✗ ERROR:", error.message);
    return NextResponse.json({ error: "Ett tekniskt fel uppstod. Vänligen försök igen." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
