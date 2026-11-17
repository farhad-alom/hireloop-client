// Server-only session helper: reads the better-auth session from the
// request cookies. Usable in Server Components and Route Handlers
// (anything that runs on the server) — never import this from a
// "use client" file.
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export const getSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    return session
}
