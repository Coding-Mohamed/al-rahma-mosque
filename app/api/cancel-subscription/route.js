// app/api/cancel-subscription/route.js

import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Find customer
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ error: "Ingen prenumeration hittades" }, { status: 404 });
    }

    const customer = customers.data[0];

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
    });

    // Cancel all active subscriptions
    const cancelPromises = subscriptions.data.map((sub) => stripe.subscriptions.cancel(sub.id));

    await Promise.all(cancelPromises);

    return NextResponse.json({
      success: true,
      message: "Prenumeration avslutad",
    });
  } catch (error) {
    console.error("Cancel error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
