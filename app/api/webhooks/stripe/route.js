// app/api/webhooks/stripe/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  try {
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    switch (event.type) {
      case "customer.subscription.created":
        // Handle new subscription
        break;
      case "customer.subscription.updated":
        // Handle subscription update
        break;
      case "customer.subscription.deleted":
        // Handle cancellation
        break;
      case "invoice.payment_succeeded":
        // Send receipt email
        break;
      case "invoice.payment_failed":
        // Handle failed payment
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
