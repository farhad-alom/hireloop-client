"use client"

// The interactive part of the checkout page: the Pay button.
// It is a normal HTML form that POSTs to /api/checkout_session, and the
// route answers with a redirect to Stripe's hosted checkout page.
// useFormStatus (react-dom) tells us when the form is submitting so the
// button can show a "Redirecting..." state.

import { useFormStatus } from "react-dom"
import { Loader2Icon, LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

// Must be rendered inside the <form> so useFormStatus can see it.
function PayButton({ priceLabel }: { priceLabel: string }) {
    const { pending } = useFormStatus()

    return (
        <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={pending}
            aria-busy={pending}
        >
            {pending ? (
                <>
                    <Loader2Icon data-icon="inline-start" className="animate-spin" />
                    Redirecting to Stripe...
                </>
            ) : (
                <>
                    <LockIcon data-icon="inline-start" />
                    Pay {priceLabel}
                </>
            )}
        </Button>
    )
}

export function CheckoutForm({ priceLabel }: { priceLabel: string }) {
    return (
        <form action="/api/checkout_session" method="POST">
            <PayButton priceLabel={priceLabel} />
        </form>
    )
}
