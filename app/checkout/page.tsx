// Checkout page (Figma: "Public/Checkout — Stripe Payment").
// A server component: it reads the price of the HireLoop Pro plan
// straight from Stripe so the amount shown is always the real one,
// then renders the plan summary and the Pay button.
import Link from "next/link"
import {
    ArrowLeftIcon,
    CheckIcon,
    CircleAlertIcon,
    InfoIcon,
    LockIcon,
} from "lucide-react"

import { stripe } from "@/lib/stripe"
import { CheckoutForm } from "@/components/checkout/CheckoutClient"

// Fixed "en-US" locale to avoid hydration mismatches (like JobDetails).
const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
})

// Perks listed under the plan (Figma copy, adapted to what Pro unlocks).
const planFeatures = [
    "Apply to unlimited jobs",
    "Message recruiters directly",
    "Priority application review",
    "Ad-free browsing",
]

export default async function CheckoutPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // Flags the checkout_session route adds when the user cancels on
    // Stripe ("Cancel and return") or when creating the session failed.
    const { canceled, error } = await searchParams

    // Ask Stripe for the price of the plan. The product is expanded so
    // we can show its name. If Stripe is unreachable we show a friendly
    // error instead of crashing the page.
    let planName = "HireLoop Pro Plan"
    let priceLabel = ""

    try {
        const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID!, {
            expand: ["product"],
        })

        if (typeof price.unit_amount === "number" && price.unit_amount > 0) {
            priceLabel = priceFormatter.format(price.unit_amount / 100)
        }

        // product can be a string id, the Product object, or a "deleted
        // product" stub — only the real object has a usable name.
        const product =
            price.product &&
            typeof price.product === "object" &&
            !("deleted" in price.product)
                ? price.product
                : null
        if (product?.name && product.name !== "HireLoopPro") {
            planName = product.name
        }
    } catch (err) {
        console.error("Could not load the Stripe price:", err)
        return (
            <main className="mx-auto w-full max-w-3xl p-3 md:p-8">
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                    <CircleAlertIcon className="mx-auto size-10 text-destructive" />
                    <h1 className="mt-4 text-2xl font-bold">Checkout unavailable</h1>
                    <p className="mt-2 text-muted-foreground">
                        We could not reach Stripe to load the plan price. Please try
                        again in a moment.
                    </p>
                    <Link
                        href="/browse-jobs"
                        className="mt-6 inline-block text-sm text-brand underline-offset-4 hover:underline"
                    >
                        Back to job search
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="mx-auto w-full max-w-5xl p-3 md:p-8">
            {/* Small header row: back link + page title */}
            <div className="mb-6 flex items-center gap-2">
                <Link
                    href="/browse-jobs"
                    className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Back to job search"
                >
                    <ArrowLeftIcon className="size-4" />
                </Link>
                <h1 className="text-lg font-semibold">Subscribe to HireLoop Pro</h1>
            </div>

            {/* Banners for canceled / failed payments */}
            {canceled && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm">
                    <InfoIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                    <p>
                        Payment canceled — you have not been charged. You can safely
                        try again whenever you are ready.
                    </p>
                </div>
            )}
            {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                    <CircleAlertIcon className="mt-0.5 size-4 shrink-0" />
                    <p>
                        Something went wrong while starting the checkout. No money
                        was taken — please try again.
                    </p>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Left column: the plan summary */}
                <section className="rounded-xl border border-border bg-card p-6">
                    <h2 className="text-xl font-bold">{planName}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Unlock the full HireLoop experience: apply to as many jobs as
                        you like and talk to recruiters directly.
                    </p>

                    {/* Dynamically displayed price, read from Stripe */}
                    <p className="mt-6 text-4xl font-bold tracking-tight">
                        {priceLabel}
                        <span className="ml-2 align-middle text-sm font-normal text-muted-foreground">
                            one-time payment
                        </span>
                    </p>

                    <ul className="mt-6 space-y-3">
                        {planFeatures.map((feature) => (
                            <li
                                key={feature}
                                className="flex items-center gap-3 text-sm"
                            >
                                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                                    <CheckIcon className="size-3" />
                                </span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Right column: payment information + Pay button */}
                <section className="flex flex-col rounded-xl border border-border bg-card p-6">
                    <h2 className="text-xl font-bold">Payment Information</h2>
                    <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-muted/40 p-4 text-sm">
                        <span className="text-muted-foreground">{planName}</span>
                        <span className="font-semibold">{priceLabel}</span>
                    </div>

                    <div className="mt-6">
                        <CheckoutForm priceLabel={priceLabel} />
                    </div>

                    <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <LockIcon className="size-3" />
                        You will be redirected to Stripe&apos;s secure checkout to
                        complete the payment.
                    </p>
                    <p className="mt-auto pt-6 text-center text-xs text-muted-foreground">
                        Powered by{" "}
                        <span className="font-semibold text-foreground">stripe</span>
                    </p>
                </section>
            </div>
        </main>
    )
}
