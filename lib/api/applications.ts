// Typed fetch helpers for the Express applications API.

import type { ApplicationWithJob } from "@/types/application";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

// Sends a job application for the logged-in user. Only the jobId is sent —
// the Express API reads the better-auth session cookie to get the
// user id and email, so the client cannot apply for someone else.
export const applyToJob = async (
    jobId: string
): Promise<{ ok: boolean; error?: string }> => {
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
        // 403 not a job seeker, 409 already applied...).
        const data = await res.json().catch(() => null);
        return { ok: false, error: data?.error ?? "Could not submit application" };
    } catch {
        return { ok: false, error: "Could not reach the server. Try again." };
    }
};

// Loads the logged-in user's applications (with job details merged in).
// A network error is returned as a normal result so the page can show
// a friendly error message instead of crashing.
export const getMyApplications = async (): Promise<{
    ok: boolean;
    applications: ApplicationWithJob[];
    error?: string;
}> => {
    try {
        const res = await fetch(`${BASE_URL}/applications/my`, {
            cache: "no-store",
            credentials: "include",
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
