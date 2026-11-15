import { getJobs } from "@/lib/api/jobs";
import { JobSearchBar } from "@/components/jobs/JobSearchBar";
import { JobFilters } from "@/components/jobs/JobFilters";
import { SortSelect } from "@/components/jobs/SortSelect";
import { JobCard } from "@/components/jobs/JobCard";
import type { JobRecord } from "@/types/job";

// searchParams values can be a single string or an array (repeated params).
const toList = (value: string | string[] | undefined) =>
    value === undefined ? [] : Array.isArray(value) ? value : [value];

// Counts how many jobs match each value, e.g. { "full-time": 5 }.
const countBy = (jobs: JobRecord[], getValue: (job: JobRecord) => string) =>
    jobs.reduce<Record<string, number>>((acc, job) => {
        const value = getValue(job);
        acc[value] = (acc[value] ?? 0) + 1;
        return acc;
    }, {});

const BrowseJobPage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
    const params = await searchParams;

    const urlSearch = new URLSearchParams(params as Record<string, string>);
    const query = urlSearch.toString();
    const jobs = await getJobs(query).catch(() => []);

    // Reads of the params the filters and search bar render from.
    const search = typeof params.search === "string" ? params.search : "";
    const selection = {
        jobTypes: toList(params.JobType),
        categories: toList(params.category),
        workplaces: toList(params.isRemote),
    };

    const counts = {
        jobType: countBy(jobs, (job) => job.jobType),
        category: countBy(jobs, (job) => job.jobCategory),
        workplace: countBy(jobs, (job) => (job.isRemote ? "true" : "false")),
    };

    return (
        <main className="mx-auto w-full max-w-7xl p-3 md:p-5">
            <JobSearchBar defaultValue={search} />

            <div className="mt-4 grid items-start gap-4 lg:grid-cols-[270px_minmax(0,1fr)]">
                <JobFilters selection={selection} counts={counts} />

                <section>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h1 className="text-lg font-bold">
                            Found {jobs.length} Professional Jobs
                        </h1>
                        <SortSelect />
                    </div>

                    {jobs.length > 0 ? (
                        <div className="mt-4 space-y-3">
                            {jobs.map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))}
                        </div>
                    ) : (
                        <p className="mt-4 rounded-xl bg-card p-8 text-center text-muted-foreground">
                            No jobs found. Try adjusting your search or filters.
                        </p>
                    )}
                </section>
            </div>
        </main>
    );
};

export default BrowseJobPage;
