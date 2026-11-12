import type { JobData } from "@/lib/actions/jobs";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

export interface JobRecord extends JobData {
    _id: string;
}

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
