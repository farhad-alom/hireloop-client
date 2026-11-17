// Checkout success page (Figma: "Public/Checkout — Payment Successful").
// A server component: Stripe redirects here with a session_id, and we
// verify the payment ON THE SERVER before showing success — arriving on
// this page alone does not mean the money was actually received.
import Link from "next/link"
import {
    ArrowRightIcon,
    CheckIcon,
    CircleAlertIcon,
    InfoIcon,
} from "lucide-react"

import { stripe } from "@/lib/stripe"

// Fixed "en-US" locale to avoid hydration mismatches (like JobDetails).
const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
})

export default async function CheckoutSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // Stripe appends ?session_id=... to the success_url we gave it.
    const { session_id: sessionId } = await searchParams

    // Guard: someone visiting /checkout/success by hand has no session id.
    if (typeof sessionId !== "string" || sessionId.length === 0) {
        return (
            <StatusCard
                icon={<CircleAlertIcon className="size-10 text-destructive" />}
                title="Payment not completed"
                description="We did not receive a payment confirmation. If you tried to pay, please start the checkout again."
                showBrowseButton={false}
            />
        )
    }

    // Verify with Stripe: only a session that really exists AND is paid
    // counts as a successful payment. A forged session_id fails here.
    let paid = false
    let email = ""
    let amountLabel = ""

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        paid = session.payment_status === "paid"
        email = session.customer_details?.email ?? ""
        if (typeof session.amount_total === "number" && session.amount_total > 0) {
            amountLabel = priceFormatter.format(session.amount_total / 100)
        }
    } catch (err) {
        console.error("Verifying the Stripe checkout session failed:", err)
        return (
            <StatusCard
                icon={<CircleAlertIcon className="size-10 text-destructive" />}
                title="We could not verify your payment"
                description="Something went wrong while checking the payment with Stripe. If your card was charged, the upgrade will appear shortly — try reloading this page."
                showBrowseButton={false}
            />
        )
    }

    if (!paid) {
        return (
            <StatusCard
                icon={<InfoIcon className="size-10 text-brand" />}
                title="Payment not finished yet"
                description="Stripe has not confirmed this payment. If you just completed it, give it a moment and reload this page."
                showBrowseButton={false}
            />
        )
    }

    // Success — matches the Figma "Payment Successful" screen.
    return (
        <StatusCard
            icon={
                <span className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                    <CheckIcon className="size-7" />
                </span>
            }
            title="Welcome to HireLoop Pro!"
            description="Your account has been activated. You can now apply to as many jobs as you like and message recruiters directly."
            extra={
                email ? (
                    <p className="text-xs text-muted-foreground">
                        {amountLabel && <>Payment of {amountLabel} received. </>}
                        A receipt was sent to <span className="text-foreground">{email}</span>.
                    </p>
                ) : undefined
            }
        />
    )
}

/* ---------- The shared centered card ---------- */

function StatusCard({
    icon,
    title,
    description,
    extra,
    showBrowseButton = false,
}: {
    icon: React.ReactNode
    title: string
    description: string
    extra?: React.ReactNode
    showBrowseButton?: boolean
}) {
    return (
        <main className="mx-auto w-full max-w-lg p-3 md:p-8">
            <div className="rounded-xl border border-border bg-card p-8 text-center md:p-10">
                <div className="flex justify-center">{icon}</div>
                <h1 className="mt-5 text-2xl font-bold">{title}</h1>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {description}
                </p>
                {extra && <div className="mt-4">{extra}</div>}

                {showBrowseButton ? (
                    <Link
                        href="/browse-jobs"
                        className="mt-8 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/85"
                    >
                        Start Browsing Opportunities
                        <ArrowRightIcon className="size-4" />
                    </Link>
                ) : (
                    <Link
                        href="/checkout"
                        className="mt-8 inline-flex h-10 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                        Back to checkout
                    </Link>
                )}
            </div>
        </main>
    )
}
