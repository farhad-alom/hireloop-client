import type { JobData, JobMutationResult, JobRecord } from "@/types/job";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";



export const getJobs = async (query = ''): Promise<JobRecord[]> => {
    const res = await fetch(`${BASE_URL}/jobs?${query}`, {
        cache: "no-store",
    });

    return res.json();
};

export const getJob = async (jobId: string): Promise<JobRecord | null> => {
    // A missing or malformed id can never match a job — skip the request.
    if (!jobId || !/^[0-9a-fA-F]{24}$/.test(jobId)) {
        return null;
    }

    try {
        const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
            cache: "no-store",
        });

        // 404 means the job does not exist — not an error worth throwing.
        if (!res.ok) {
            return null;
        }

        return res.json();
    } catch {
        // API is down — the page shows its "job not available" message.
        return null;
    }
};

// Sends a job application for the logged-in user.
// The Express API reads the better-auth session cookie to know who applies.
export const applyToJob = async (
    jobId: string
): Promise<{ ok: boolean; error?: string }> => {
    try {
        const res = await fetch(`${BASE_URL}/jobs/${jobId}/apply`, {
            method: "POST",
            credentials: "include",
        });

        if (res.ok) {
            return { ok: true };
        }

        // The API explains the problem (401 not logged in, 409 already applied...).
        const data = await res.json().catch(() => null);
        return { ok: false, error: data?.error ?? "Could not submit application" };
    } catch {
        return { ok: false, error: "Could not reach the server. Try again." };
    }
};

export const createJob = async (jobData: JobData): Promise<JobMutationResult> => {
    const res = await fetch(`${BASE_URL}/jobs`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(jobData),
    });

    return res.json();
};

export const updateJob = async (
    jobId: string,
    jobData: Partial<JobData>
): Promise<JobMutationResult> => {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(jobData),
    });

    return res.json();
};

export const deleteJob = async (jobId: string): Promise<JobMutationResult> => {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
        method: "DELETE",
        credentials: "include",
    });

    return res.json();
};

// 