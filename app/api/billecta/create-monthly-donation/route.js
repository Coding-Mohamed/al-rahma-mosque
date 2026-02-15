// app/api/billecta/create-monthly-donation/route.js
// SÄKER VERSION - Baserad på din fungerande kod

import { NextResponse } from "next/server";

const BILLECTA_CONFIG = {
  baseUrl: "https://apitest.billecta.com",
  username: process.env.BILLECTA_USERNAME,
  password: process.env.BILLECTA_PASSWORD,
  creditorPublicId: process.env.BILLECTA_CREDITOR_ID,
  monthlyDonationProductId: process.env.BILLECTA_MONTHLY_PRODUCT_ID,
};

// =============================================================================
// SÄKERHETSFUNKTIONER
// =============================================================================

// Rate limiting - Simple in-memory
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 10; // Max 10 donations per 15 min

function checkRateLimit(identifier) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(identifier) || [];
  const validRequests = userRequests.filter((time) => now - time < RATE_LIMIT_WINDOW);

  if (validRequests.length >= MAX_REQUESTS) {
    return false;
  }

  validRequests.push(now);
  rateLimitMap.set(identifier, validRequests);
  return true;
}

// GDPR-compliant logging
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

// Input validation
function validateInput(body) {
  const errors = [];

  // Amount validation
  const amount = parseInt(body.amount);
  if (isNaN(amount) || amount < 50 || amount > 100000) {
    errors.push("Beloppet måste vara mellan 50 och 100,000 kr");
  }

  // Name validation
  if (!body.name || body.name.length < 2 || body.name.length > 100) {
    errors.push("Namnet måste vara mellan 2 och 100 tecken");
  }
  if (!/^[a-zA-ZåäöÅÄÖ\s\-']+$/.test(body.name)) {
    errors.push("Namnet får endast innehålla bokstäver");
  }

  // Email validation
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push("Ogiltig e-postadress");
  }

  // Personal number validation
  if (!body.personalNumber || !/^\d{6,8}-?\d{4}$/.test(body.personalNumber)) {
    errors.push("Ogiltigt personnummer format");
  }

  return { valid: errors.length === 0, errors };
}

// Enhanced sanitize with length limits
function sanitize(input) {
  if (typeof input !== "string") return input;
  return input.trim().replace(/[<>]/g, "").slice(0, 200);
}

// =============================================================================
// BILLECTA API HELPERS (unchanged from your working version)
// =============================================================================

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

// =============================================================================
// MAIN POST HANDLER
// =============================================================================

export async function POST(request) {
  try {
    console.log("\n" + "=".repeat(60));
    console.log("NEW AUTOGIRO DONATION REQUEST");
    console.log("=".repeat(60));

    // =========================================================================
    // SÄKERHET: Rate Limiting
    // =========================================================================
    const clientId = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    if (!checkRateLimit(clientId)) {
      console.log("  ✗ RATE LIMIT EXCEEDED:", clientId);
      return NextResponse.json({ error: "För många försök. Försök igen om 15 minuter." }, { status: 429 });
    }

    // =========================================================================
    // SÄKERHET: Input Validation
    // =========================================================================
    const body = await request.json();
    const validation = validateInput(body);

    if (!validation.valid) {
      console.log("  ✗ VALIDATION FAILED:", validation.errors[0]);
      return NextResponse.json({ error: validation.errors[0] }, { status: 400 });
    }

    // =========================================================================
    // SÄKERHET: GDPR-compliant Logging
    // =========================================================================
    console.log("\n[1] PARSE REQUEST");
    console.log("  Amount:", body.amount, "kr");
    console.log("  Name:", body.name);
    console.log("  Email:", maskEmail(body.email));
    console.log("  Personal Number:", maskPersonalNumber(body.personalNumber));

    const amount = parseInt(body.amount);
    const email = sanitize(body.email);
    const name = sanitize(body.name);
    const personalNumber = sanitize(body.personalNumber);

    // ========================================
    // 2. CREATE/UPDATE DEBTOR
    // ========================================

    console.log("\n[2] CREATE/UPDATE DEBTOR (WITHOUT BANK INFO)");

    let debtorPublicId;

    try {
      console.log("  Checking for existing debtor...");
      const existing = await billectaRequest(`/v1/debtors/debtorsbyorgno/${BILLECTA_CONFIG.creditorPublicId}?orgno=${personalNumber}&countrycode=SE`);

      if (existing?.length > 0) {
        debtorPublicId = existing[0].DebtorPublicId;
        console.log("  ✓ Debtor exists:", debtorPublicId);
        console.log("  Updating debtor info...");

        await billectaRequest("/v1/debtors/debtor", "PUT", {
          DebtorPublicId: debtorPublicId,
          CreditorPublicId: BILLECTA_CONFIG.creditorPublicId,
          Name: name,
          Email: email,
          OrgNo: personalNumber,
          CountryCode: "SE",
        });

        console.log("  ✓ Debtor updated");
      } else {
        console.log("  Creating new debtor...");

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
      // SÄKERHET: Generic error message to user
      return NextResponse.json({ error: "Ett tekniskt fel uppstod. Vänligen försök igen." }, { status: 500 });
    }

    // ========================================
    // 3. CREATE CONTRACT INVOICE
    // ========================================

    console.log("\n[3] CREATE CONTRACT INVOICE");

    try {
      const today = new Date();
      const startDate = today.toISOString().split("T")[0];
      const amountInOre = amount * 100;

      const contractInvoiceData = {
        CreditorPublicId: BILLECTA_CONFIG.creditorPublicId,
        DebtorPublicId: debtorPublicId,
        Records: [
          {
            ProductPublicId: BILLECTA_CONFIG.monthlyDonationProductId,
            ArticleDescription: `Månatlig donation ${amount} kr`,
            Quantity: 1,
            UnitPrice: {
              Value: amountInOre,
              CurrencyCode: "SEK",
            },
            VATPercent: 0,
          },
        ],
        RecurrenceDetails: {
          RecurrenceInterval: "Monthly",
          Start: startDate,
          NoEndDate: true,
          End: null,
          MonthlyRecurrence: {
            RecurOnDayInMonth: 1,
            RecurMonthInterval: 1,
          },
        },
        Autogiro: {
          AutogiroWithdrawalEnabled: true,
        },
        AutoAttestEnabled: true,
        DeliveryMethod: "Email", // ÄNDRAT: Email istället för Manually så Billecta skickar BankID-länk
        PaymentTermsInDays: 30,
        CurrencyCode: "SEK",
      };

      console.log("  Creating Contract Invoice...");
      console.log("  Debtor:", debtorPublicId);
      console.log("  Amount:", amount, "kr (", amountInOre, "öre)");
      console.log("  Recurring: Monthly starting", startDate);
      console.log("  Autogiro: ✓ Enabled");
      console.log("  DeliveryMethod: Email");

      const contractInvoice = await billectaRequest("/v1/contractinvoice/action", "POST", contractInvoiceData);

      console.log("  ✓ Contract Invoice created!");
      console.log("  ID:", contractInvoice.PublicId);

      console.log("\n" + "=".repeat(60));
      console.log("✓✓✓ SUCCESS - AUTOGIRO DONATION CREATED ✓✓✓");
      console.log("=".repeat(60));
      console.log("Contract Invoice ID:", contractInvoice.PublicId);
      console.log("Amount:", amount, "kr/month");
      console.log("Start:", startDate);
      console.log("=".repeat(60) + "\n");

      return NextResponse.json({
        success: true,
        contractInvoiceId: contractInvoice.PublicId,
        debtorId: debtorPublicId,
        amount: amount,
        startDate: startDate,
        message: "Donation skapad! Ett email med BankID-signering har skickats till din e-post.",
      });
    } catch (error) {
      console.log("  ✗ Contract Invoice failed!");
      console.log("  Error:", error.message);
      // SÄKERHET: Generic error message to user
      return NextResponse.json({ error: "Ett tekniskt fel uppstod. Vänligen försök igen." }, { status: 500 });
    }
  } catch (error) {
    console.log("\n" + "=".repeat(60));
    console.log("✗✗✗ ERROR ✗✗✗");
    console.log("=".repeat(60));
    console.log("Message:", error.message);
    console.log("=".repeat(60) + "\n");

    // SÄKERHET: Generic error message to user
    return NextResponse.json({ error: "Ett tekniskt fel uppstod. Vänligen försök igen." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
