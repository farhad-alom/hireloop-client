// Shared application types for the whole app.

// One job application, as stored in MongoDB's "applications" collection.
// The server fills in everything except the jobId — the client only
// sends the jobId, and the server takes the user info from the session.
export interface Application {
    _id?: string;
    jobId: string;
    userId: string;
    email: string;
    // "pending" | "review" | "accepted" | "rejected" (set by the API).
    status?: string;
    // Set by the API when the application is created.
    appliedAt?: string;
}

// The job info shown next to an application on the "My Applications" page.
// The server merges this in when listing applications.
export interface ApplicationJob {
    title: string;
    companyName: string;
    location: string;
    isRemote: boolean;
    jobType: string;
    minSalary: number;
    maxSalary: number;
}

// An application with its job details (job is null if the job was deleted).
export interface ApplicationWithJob extends Application {
    job: ApplicationJob | null;
}
