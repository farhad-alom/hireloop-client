// Typed fetch helpers for the Express applications API.

import type { ApplicationWithJob } from "@/types/application";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

// Sends a job application for the logged-in user. Only the jobId is sent —
// the Express API reads the better-auth session cookie to get the
// user id and email, so the client cannot apply for someone else.
// The server also enforces the free 5-application limit: when it answers
// 402 (limit reached), `limitReached` is true and the page sends the user
// to /payment.
export const applyToJob = async (
    jobId: string
): Promise<{ ok: boolean; error?: string; limitReached?: boolean }> => {
    try {
        const res = await fetch(`${BASE_URL}/applications`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ jobId }),
        });

        if (res.ok) {
            return { ok: true };
        }

        // The API explains the problem (401 not logged in,
        // 403 not a job seeker, 409 already applied, 402 limit reached...).
        const data = await res.json().catch(() => null);
        return {
            ok: false,
            error: data?.error ?? "Could not submit application",
            limitReached: res.status === 402,
        };
    } catch {
        return { ok: false, error: "Could not reach the server. Try again." };
    }
};

// How many applications the logged-in user has already used.
// JobDetails checks this before applying, so a user on the free plan
// (max 5) is sent to /payment instead of getting an API error.
export const getApplicationCount = async (): Promise<{
    ok: boolean;
    count: number;
    limit: number;
    limitReached: boolean;
    error?: string;
}> => {
    try {
        const res = await fetch(`${BASE_URL}/applications/count`, {
            cache: "no-store",
            credentials: "include",
        });

        if (!res.ok) {
            return {
                ok: false,
                count: 0,
                limit: 5,
                limitReached: false,
                error: "Could not load application count",
            };
        }

        const data = await res.json();
        return {
            ok: true,
            count: Number(data.count ?? 0),
            limit: Number(data.limit ?? 5),
            limitReached: Boolean(data.limitReached),
        };
    } catch {
        return {
            ok: false,
            count: 0,
            limit: 5,
            limitReached: false,
            error: "Could not reach the server",
        };
    }
};

// Loads the logged-in user's applications (with job details merged in).
// - From client components: call it with no arguments; the browser sends
//   its session cookie automatically (credentials: "include").
// - From a Server Component (RSC): pass the request's cookie header, e.g.
//   getMyApplications((await headers()).get("cookie") ?? "").
export const getMyApplications = async (
    cookie = ""
): Promise<{
    ok: boolean;
    applications: ApplicationWithJob[];
    error?: string;
}> => {
    try {
        const res = await fetch(`${BASE_URL}/applications/my`, {
            cache: "no-store",
            credentials: "include",
            headers: cookie ? { cookie } : undefined,
        });

        // Not logged in (or the API is down) is treated as "no applications",
        // because the dashboard itself is behind a sign-in anyway.
        if (!res.ok) {
            return { ok: false, applications: [], error: "Could not load applications" };
        }

        const applications: ApplicationWithJob[] = await res.json();
        return { ok: true, applications };
    } catch {
        return { ok: false, applications: [], error: "Could not reach the server" };
    }
};
