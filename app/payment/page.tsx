"use client";

// The payment page users land on when they reach the free plan limit
// (5 job applications). It explains the plans and shows a Pay Now button.
//
// NOTE: Pay Now is a PLACEHOLDER — Stripe Checkout will be integrated here
// later. No real payment happens yet; the button only shows an info message.

import { useState } from "react";
import Link from "next/link";
import { Check, Lock } from "lucide-react";

// The free limit — keep in sync with FREE_APPLICATION_LIMIT in SERVER/index.js.
const FREE_APPLICATION_LIMIT = 5;

// What the Pro plan includes (simple marketing list).
const PRO_FEATURES = [
    "Unlimited job applications",
    "See your application status updates",
    "Priority support",
];

export default function PaymentPage() {
    // Shown after clicking Pay Now (until Stripe Checkout is added).
    const [payMessage, setPayMessage] = useState("");

    // Placeholder for the future Stripe Checkout integration.
    function handlePayNow() {
        setPayMessage(
            "Stripe Checkout is coming soon — online payment is not available yet."
        );
    }

    return (
        <main className="mx-auto w-full max-w-md p-4 py-12 md:p-6">
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <h1 className="text-center text-2xl font-bold">
                    Upgrade to HireLoop Pro
                </h1>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    You reached the free plan limit of {FREE_APPLICATION_LIMIT}{" "}
                    job applications. Upgrade to keep applying.
                </p>

                {/* Plan summary */}
                <div className="mt-6 rounded-xl border border-border bg-background p-5">
                    <p className="text-sm text-muted-foreground">HireLoop Pro Plan</p>
                    <p className="mt-1 flex items-baseline gap-1">
                        <span className="text-4xl font-bold">$39</span>
                        <span className="text-sm text-muted-foreground">
                            / month
                        </span>
                    </p>

                    <ul className="mt-4 space-y-2 text-sm">
                        {PRO_FEATURES.map((feature) => (
                            <li
                                key={feature}
                                className="flex items-center gap-2 text-muted-foreground"
                            >
                                <Check
                                    className="size-4 shrink-0 text-emerald-400"
                                    aria-hidden="true"
                                />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Pay Now (placeholder) */}
                <button
                    type="button"
                    onClick={handlePayNow}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover"
                >
                    <Lock className="size-4" aria-hidden="true" />
                    Pay Now
                </button>

                {/* Info shown by the placeholder click */}
                {payMessage && (
                    <p className="mt-3 text-center text-sm text-muted-foreground">
                        {payMessage}
                    </p>
                )}

                <p className="mt-5 text-center text-xs text-muted-foreground">
                    Payments are processed securely. Cancel anytime.
                </p>

                <p className="mt-2 text-center text-sm">
                    <Link
                        href="/browse-jobs"
                        className="text-brand-muted transition-colors hover:text-brand-muted/75"
                    >
                        Keep browsing jobs instead
                    </Link>
                </p>
            </div>
        </main>
    );
}
