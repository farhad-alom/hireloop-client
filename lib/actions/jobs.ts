

export interface JobData {
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
}


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// HTML ফর্মের সাবমিট করা ডাটা ক্যাপচার করার বিল্ট-ইন FormData অবজেক্ট।
export const createJob = async (jobData: JobData) => {
    const res = await fetch(`${BASE_URL}/jobs`, {
        method: "POST",
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(jobData),// গোছানো অবজেক্টটি জেসন স্ট্রিং হয়ে সার্ভারে যাচ্ছে
    });
    return res.json();
}

