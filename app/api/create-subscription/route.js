// app/api/create-subscription/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with error handling
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY is missing from environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Input validation helper
function validateInput(amount, email, name) {
  const errors = [];

  if (!amount || isNaN(amount) || amount < 10) {
    errors.push("Ogiltigt belopp (minst 10 kr)");
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Ogiltig email-adress");
  }

  if (!name || name.trim().length < 2) {
    errors.push("Namn måste vara minst 2 tecken");
  }

  return errors;
}

export async function POST(request) {
  try {
    console.log("🔵 API called: /api/create-subscription");

    // Parse and validate input
    const body = await request.json();
    const { amount, email, name } = body;

    console.log("📊 Request data:", { amount, email: email?.substring(0, 3) + "***", name });

    const validationErrors = validateInput(amount, email, name);
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: validationErrors.join(", ") }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedName = name.trim().substring(0, 100); // Limit name length
    const sanitizedAmount = parseInt(amount);

    // Check for existing customer with active subscription
    const existingCustomers = await stripe.customers.list({
      email: sanitizedEmail,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      const existingCustomer = existingCustomers.data[0];

      // Check for active subscriptions
      const activeSubscriptions = await stripe.subscriptions.list({
        customer: existingCustomer.id,
        status: "active",
        limit: 1,
      });

      if (activeSubscriptions.data.length > 0) {
        return NextResponse.json(
          {
            error: "Du har redan en aktiv prenumeration med denna email. " + "Använd en annan email eller hantera din befintliga prenumeration.",
          },
          { status: 400 }
        );
      }
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email: sanitizedEmail,
      name: sanitizedName,
      metadata: {
        mosque: "Al-Rahma Moské",
        created_at: new Date().toISOString(),
      },
    });

    // Create price for subscription
    const price = await stripe.prices.create({
      unit_amount: sanitizedAmount * 100, // Convert SEK to öre
      currency: "sek",
      recurring: {
        interval: "month",
      },
      product_data: {
        name: `Månatlig Donation - Al-Rahma Moské (${sanitizedAmount} SEK)`,
      },
    });

    // Get origin for redirect URLs
    const origin = request.headers.get("origin") || "http://localhost:3000";

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/donations/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donations/manage?checkout=cancelled`,
      locale: "sv",
      allow_promotion_codes: false,
      billing_address_collection: "auto",
      metadata: {
        mosque: "Al-Rahma Moské",
        amount: sanitizedAmount.toString(),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe error:", error);

    // Don't expose internal error details to client
    return NextResponse.json(
      {
        error: "Ett fel uppstod vid skapande av prenumeration. Försök igen.",
      },
      { status: 500 }
    );
  }
}

// Security: Only allow POST
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
