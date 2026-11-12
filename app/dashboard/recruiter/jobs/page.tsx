import { getJobs } from "@/lib/api/jobs";

import { JobsTable } from "./jobs-table";

export default async function RecruiterJobPage() {
    const jobs = await getJobs().catch(() => null);

    if (jobs === null) {
        return (
            <main className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
                <p className="mt-6 rounded-xl bg-card p-8 text-center text-muted-foreground">
                    Could not load jobs. Make sure the API server is running on
                    port 5000 (run <code>node index.js</code> in the SERVER
                    folder).
                </p>
            </main>
        );
    }

    return <JobsTable jobs={jobs} />;
}
