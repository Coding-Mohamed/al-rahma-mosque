// app/api/update-subscription/route.js

import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { email, newAmount } = await request.json();

    // Find customer
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ error: "Ingen prenumeration hittades" }, { status: 404 });
    }

    const customer = customers.data[0];

    // Get active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: "Ingen aktiv prenumeration hittades" }, { status: 404 });
    }

    const subscription = subscriptions.data[0];

    // Create new price
    const newPrice = await stripe.prices.create({
      unit_amount: newAmount * 100,
      currency: "sek",
      recurring: { interval: "month" },
      product_data: {
        name: `Månatlig Donation - ${newAmount} SEK`,
      },
    });

    // Update subscription
    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPrice.id,
        },
      ],
      proration_behavior: "none", // No proration
    });

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
