"use client"

// A single job card in the browse jobs list, following the Figma design:
// company logo, title, company • location line, salary / type chips
// and a bookmark button on the right.

import { Bookmark, Clock, Wallet } from "lucide-react"

import type { JobData } from "@/types/job"

// 140000 -> "$140K", 800 -> "$800".
const formatSalary = (value: number) =>
    `$${new Intl.NumberFormat("en", {
        notation: value >= 1000 ? "compact" : "standard",
        maximumFractionDigits: 0,
    }).format(value)}`;

export function JobCard({ job }: { job: JobData }) {
    // TODO: implement — save the job for the current user.
    const handleBookmark = () => {};

    return (
        <article className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-ring md:p-5">
            {/* Company logo (initial as a fallback) */}
            <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-muted text-lg font-semibold">
                {job.companyName.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {job.companyName} • {job.location}
                    {job.isRemote && " (Remote)"}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1 text-xs">
                        <Wallet className="size-3.5 text-muted-foreground" aria-hidden="true" />
                        {formatSalary(job.minSalary)} - {formatSalary(job.maxSalary)}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1 text-xs capitalize">
                        <Clock className="size-3.5 text-muted-foreground" aria-hidden="true" />
                        {job.jobType}
                    </span>
                </div>
            </div>

            <button
                type="button"
                onClick={handleBookmark}
                aria-label="Save job"
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
                <Bookmark className="size-5" />
            </button>
        </article>
    );
}
