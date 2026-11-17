// Creates a Stripe Checkout Session and sends the user to Stripe's
// hosted payment page (checkout.stripe.com).
//
// The Pay button on /checkout is a plain <form method="POST"> that
// posts here, so we always answer with a redirect (303):
//   - not signed in            -> /sign-in?next=/checkout
//   - checkout session created -> Stripe's hosted checkout page
//   - anything failed          -> back to /checkout?error=1
import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { getSession } from "@/lib/api/core/server"
import { stripe } from "@/lib/stripe"

// Label used in the Stripe dashboard to measure this Checkout
// integration separately from any others.
const INTEGRATION_IDENTIFIER = "hosted_web_hireloop_001"

// The paid product: a Stripe Price ID stored in .env (STRIPE_PRICE_ID).
// The amount charged comes from that Price object on Stripe's side —
// the browser never gets to send an amount here.
const priceId = process.env.STRIPE_PRICE_ID

export async function POST() {
    // Base URL for the success/cancel redirects (falls back to the
    // auth URL when the Origin header is missing).
    const headersList = await headers()
    const origin =
        headersList.get("origin") ??
        process.env.BETTER_AUTH_URL ??
        "http://localhost:3000"

    // 1. Only signed-in users may pay. The email below comes from the
    //    verified better-auth session — never from the request body.
    const session = await getSession()

    if (!session) {
        return NextResponse.redirect(
            `${origin}/sign-in?next=${encodeURIComponent("/checkout")}`,
            303
        )
    }

    if (!priceId) {
        console.error("STRIPE_PRICE_ID is missing in CLIENT/.env")
        return NextResponse.redirect(`${origin}/checkout?error=1`, 303)
    }

    try {
        // 2. Create the Checkout Session on the server.
        const checkoutSession = await stripe.checkout.sessions.create({
            // Shows the payer's email on checkout.stripe.com.
            customer_email: session.user.email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            // "Cancel and return to Checkout" link on the Stripe page.
            cancel_url: `${origin}/checkout?canceled=1`,
            integration_identifier: INTEGRATION_IDENTIFIER,
        })

        // 3. Send the user to Stripe's hosted checkout page.
        if (!checkoutSession.url) {
            throw new Error("Stripe did not return a checkout URL")
        }
        return NextResponse.redirect(checkoutSession.url, 303)
    } catch (err) {
        // Don't leak Stripe errors to the user — send them back to our
        // page with a friendly message instead.
        console.error("Creating the Stripe checkout session failed:", err)
        return NextResponse.redirect(`${origin}/checkout?error=1`, 303)
    }
}
