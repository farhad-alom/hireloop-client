import type { JobData, JobMutationResult, JobRecord } from "@/types/job";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

export const getJobs = async (): Promise<JobRecord[]> => {
    const res = await fetch(`${BASE_URL}/jobs`, {
        cache: "no-store",
    });

    return res.json();
};

export const getJob = async (jobId: string): Promise<JobRecord | null> => {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
        cache: "no-store",
    });

    return res.json();
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
