// Shared job types for the whole app.

export interface JobData {
    _id?: string;
    title: string;
    companyName: string;
    jobCategory: string;
    department: string;
    jobType: string;
    isRemote: boolean;
    location: string;
    deadline: string;
    minSalary: number;
    maxSalary: number;
    // Optional: the salary period is no longer collected in the job form.
    salaryFrequency?: string;
    responsibilities: string;
    qualifications: string;
    status?: string;
    applicants?: number;
    postedAt?: string;
    // Set by the API on create (MongoDB `createdAt`).
    createdAt?: string;
}

// A job as it comes back from the API (always has an _id).
export interface JobRecord extends JobData {
    _id: string;
}

// What the API returns after create / update / delete.
export interface JobMutationResult {
    acknowledged?: boolean;
    insertedId?: string;
    deletedCount?: number;
    matchedCount?: number;
    modifiedCount?: number;
    error?: string;
}
