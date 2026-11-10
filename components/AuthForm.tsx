"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

const inputClass =
    "w-full rounded-xl border border-input bg-muted/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"

const roleClass = (active: boolean) =>
    active
        ? "grow rounded-xl border border-brand bg-brand/20 px-3 py-2.5 text-center text-sm font-medium text-foreground transition-colors"
        : "grow rounded-xl border border-input bg-muted/40 px-3 py-2.5 text-center text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground"

const ROLES = [
    { value: "seeker", label: "Job Seeker" },
    { value: "recruiter", label: "Recruiter" },
    { value: "admin", label: "Admin" },
] as const

type Role = (typeof ROLES)[number]["value"]

const tabClass = (active: boolean) =>
    active
        ? "rounded-full bg-brand py-2 text-brand-foreground transition-colors"
        : "rounded-full py-2 text-muted-foreground transition-colors hover:text-foreground"

export function AuthForm({ initialSignIn }: { initialSignIn: boolean }) {
    const showSignIn = initialSignIn
    const router = useRouter()

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState<Role>("seeker")

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError("")

        const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>

        if (!showSignIn && data.password !== data.confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)

        const { data: result, error } = showSignIn
            ? await authClient.signIn.email({ email: data.email, password: data.password })
            : await authClient.signUp.email({
                name: data.name,
                email: data.email,
                password: data.password,
                role,
            })

        setLoading(false)

        if (error) {
            setError(error.message ?? "Something went wrong")
            return
        }

        console.log("data from the signin", data, "redirect and tokens: ", result)

        router.push("/")
        router.refresh()
    }




    return (
        <main className="flex items-start justify-center bg-background px-4 py-10 text-foreground">
            <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 md:p-8">

                <div className="grid grid-cols-2 gap-1 rounded-full bg-muted p-1 text-center text-sm font-medium">
                    <Link href="/sign-in" className={tabClass(showSignIn)}>Sign In</Link>
                    <Link href="/sign-up" className={tabClass(!showSignIn)}>Sign Up</Link>
                </div>


                <h1 className="mt-6 text-center text-2xl font-bold md:text-3xl">
                    {showSignIn ? "Welcome back" : "Create your account"}
                </h1>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    {showSignIn
                        ? "Sign in to continue your job hunt."
                        : "Join HireLoop and find your dream job."}
                </p>

                <form key={String(showSignIn)} onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {!showSignIn && (
                        <div>
                            <label htmlFor="name" className="mb-1.5 block text-sm text-muted-foreground">Full Name</label>
                            <input id="name" name="name" type="text" placeholder="Your name" required className={inputClass} />
                        </div>
                    )}

                    {!showSignIn && (
                        <div>
                            <label className="mb-1.5 block text-sm text-muted-foreground">I am a</label>
                            <div className="flex gap-2">
                                {ROLES.map((r) => (
                                    <button
                                        key={r.value}
                                        type="button"
                                        onClick={() => setRole(r.value)}
                                        className={roleClass(role === r.value)}
                                        aria-pressed={role === r.value}
                                    >
                                        {r.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm text-muted-foreground">Email</label>
                        <input id="email" name="email" type="email" placeholder="you@example.com" required className={inputClass} />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1.5 block text-sm text-muted-foreground">Password</label>
                        <input id="password" name="password" type="password" placeholder="••••••••" required minLength={8} className={inputClass} />
                    </div>

                    {!showSignIn && (
                        <div>
                            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm text-muted-foreground">
                                Confirm Password
                            </label>
                            <input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required minLength={8} className={inputClass} />
                        </div>
                    )}

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full rounded-full bg-brand py-2.5 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover disabled:opacity-60"
                    >
                        {loading ? "Please wait..." : showSignIn ? "Sign In" : "Sign Up"}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-muted-foreground">
                    {showSignIn ? "Don't have an account? " : "Already have an account? "}
                    <Link
                        href={showSignIn ? "/sign-up" : "/sign-in"}
                        className="font-medium text-brand-muted transition-colors hover:text-brand-muted/75"
                    >
                        {showSignIn ? "Sign Up" : "Sign In"}
                    </Link>
                </p>
            </div>
        </main>
    )
}
