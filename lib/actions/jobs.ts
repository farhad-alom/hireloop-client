

export interface JobData {
    _id?: string;
    title: string;
    companyName: string;
    jobCategory: string;
    jobType: string;
    isRemote: boolean;
    location: string;
    deadline: string;
    minSalary: number;
    maxSalary: number;
    salaryFrequency: string;
    responsibilities: string;
    qualifications: string;
    status?: string;
}

export interface JobMutationResult {
    acknowledged?: boolean;
    insertedId?: string;
    deletedCount?: number;
    matchedCount?: number;
    modifiedCount?: number;
    error?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// HTML ফর্মের সাবমিট করা ডাটা ক্যাপচার করার বিল্ট-ইন FormData অবজেক্ট।
export const createJob = async (jobData: JobData): Promise<JobMutationResult> => {
    const res = await fetch(`${BASE_URL}/jobs`, {
        method: "POST",
        headers: {
            'content-type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(jobData),// গোছানো অবজেক্টটি জেসন স্ট্রিং হয়ে সার্ভারে যাচ্ছে
    });
    return res.json();
}

export const updateJob = async (jobId: string, jobData: Partial<JobData>): Promise<JobMutationResult> => {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
        method: "PUT",
        headers: {
            'content-type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(jobData),
    });
    return res.json();
}

export const deleteJob = async (jobId: string): Promise<JobMutationResult> => {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
        method: 'DELETE',
        credentials: "include",
    });
    return res.json();
}
