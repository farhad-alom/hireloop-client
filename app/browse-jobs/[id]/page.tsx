import { getJob } from "@/lib/api/jobs";
import { JobDetails } from "@/components/jobs/JobDetails";

// The Job Details page, e.g. /browse-jobs/665f1c...
// The id comes from the URL, the job data comes from the Express API.
export default async function JobDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const job = await getJob(id);

    if (!job) {
        return (
            <main className="mx-auto w-full max-w-3xl p-6 text-center">
                <h1 className="text-2xl font-bold">Job not found</h1>
                <p className="mt-2 text-muted-foreground">
                    This job does not exist or is no longer available.
                </p>
            </main>
        );
    }

    return <JobDetails job={job} />;
}


