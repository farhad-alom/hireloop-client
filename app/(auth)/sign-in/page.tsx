import { Suspense } from "react"
import { AuthForm } from "@/components/AuthForm"

export default function SignInPage() {
    // AuthForm reads the `next` query param with useSearchParams(),
    // which needs a Suspense boundary for the static prerender.
    return (
        <Suspense>
            <AuthForm initialSignIn />
        </Suspense>
    )
}
