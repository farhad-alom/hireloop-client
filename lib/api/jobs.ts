import type { JobData } from "@/lib/actions/jobs";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const getJobs = async (): Promise<JobData[]> => {
    const res = await fetch(`${BASE_URL}/jobs`, {
        cache: "no-store",
    });

    return res.json();
};