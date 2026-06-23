import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const MIN_DONATION_USD = 1;
const MAX_DONATION_USD = 500;

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  return new Stripe(secretKey);
}

function getAppUrl(request: NextRequest) {
  return process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();
    const donationAmount = Number(amount);

    if (
      !Number.isFinite(donationAmount) ||
      donationAmount < MIN_DONATION_USD ||
      donationAmount > MAX_DONATION_USD
    ) {
      return NextResponse.json(
        {
          error: `Donation amount must be between $${MIN_DONATION_USD} and $${MAX_DONATION_USD}.`,
        },
        { status: 400 }
      );
    }

    const appUrl = getAppUrl(request);
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Support Lilly voluntary donation",
              description:
                "Test donation page for supporting Lilly. Use Stripe test cards while in test mode.",
            },
            unit_amount: Math.round(donationAmount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/support/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/support/cancel`,
      custom_text: {
        submit: {
          message:
            "This donation checkout is currently for testing Lilly support payments.",
        },
      },
      metadata: {
        purpose: "support_lilly",
        test_notice: "This checkout is configured as a Lilly support test flow.",
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Unable to create checkout session." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error("Support checkout error:", error);
    return NextResponse.json(
      { error: "Could not start donation checkout. Please try again later." },
      { status: 500 }
    );
  }
}
