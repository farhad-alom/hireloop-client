"use client";

import Link from "next/link";
import { GlobeIcon, MapPinIcon, PencilIcon, PlusIcon, UsersIcon } from "lucide-react";

import type { JobRecord } from "@/types/job";

import { Button } from "@/components/ui/button";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DeleteJobDialog } from "@/components/jobs/DeleteJobDialog";
import { JobCategoryIcon } from "@/components/jobs/JobCategoryIcon";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { PageHeader } from "@/components/layout/PageHeader";
import { JOB_TYPES, getJobCategoryLabel } from "@/lib/constants/jobs";

// Formatting helpers

// Uses the shared JOB_TYPES list so the label always matches the form.
function formatJobType(type: string) {
    return JOB_TYPES.find((jobType) => jobType.value === type)?.label ?? type;
}

// Locale fixed to avoid SSR/client hydration mismatches
const salaryFormatter = new Intl.NumberFormat("en-US");

function formatCompensation(job: JobRecord) {
    const min = salaryFormatter.format(Number(job.minSalary || 0));
    const max = salaryFormatter.format(Number(job.maxSalary || 0));

    return `${min} - ${max} ${job.salaryFrequency || ""}`;
}

function formatDeadline(deadline: string) {
    if (!deadline) return "Not specified";

    const date = new Date(deadline);

    if (Number.isNaN(date.getTime())) return deadline;

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// Derive status from deadline (fallback for jobs saved before statuses existed)
function getJobStatus(deadline: string) {
    if (!deadline) return "expired";

    const deadlineDate = new Date(deadline);

    if (Number.isNaN(deadlineDate.getTime())) return "expired";

    return deadlineDate.getTime() >= Date.now()
        ? "active"
        : "expired";
}

export function JobsTable({ jobs }: { jobs: JobRecord[] }) {
    return (
        <main className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
            {/* Page header */}
            <PageHeader
                breadcrumb={["Manage Jobs", "Job Listings & Postings"]}
                title="Manage Job Posts"
                description="Review live listings, monitor applicants, and update job details across your organization."
            >
                <Button
                    nativeButton={false}
                    render={
                        <Link href="/dashboard/recruiter/jobs/new" />
                    }
                    className="bg-brand text-brand-foreground hover:bg-brand-hover"
                >
                    <PlusIcon data-icon="inline-start" />
                    New Job Post
                </Button>
            </PageHeader>

            {/* Job posts table */}
            <section className="mt-6 overflow-x-auto rounded-xl bg-card">
                <Table className="min-w-272">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            {[
                                "Job Title & Category",
                                "Company & Location",
                                "Type",
                                "Compensation",
                                "Applicants",
                                "Status",
                                "Deadline",
                                "Actions",
                            ].map((heading) => (
                                <TableHead
                                    key={heading}
                                    className="text-xs tracking-wider text-muted-foreground uppercase"
                                >
                                    {heading}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {jobs.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="h-32 text-center text-muted-foreground"
                                >
                                    No job posts found. Create your first job post!
                                </TableCell>
                            </TableRow>
                        ) : (
                            jobs.map((job, index) => {
                                const status = job.status ?? getJobStatus(job.deadline);

                                return (
                                    <TableRow key={job._id ?? `${job.title}-${index}`}>
                                        {/* Job title, department & category */}
                                        <TableCell className="py-4 pl-4">
                                            <div className="flex items-center gap-3">
                                                <JobCategoryIcon category={job.jobCategory} />

                                                <div className="min-w-0">
                                                    <p className="font-medium">
                                                        {job.title}
                                                    </p>

                                                    <p className="text-xs text-muted-foreground">
                                                        {getJobCategoryLabel(job.jobCategory)}
                                                    </p>

                                                    {job.department && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {job.department}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Company & location */}
                                        <TableCell>
                                            <p className="font-medium">
                                                {job.companyName}
                                            </p>

                                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                {job.isRemote ? (
                                                    <GlobeIcon className="size-3.5 shrink-0" />
                                                ) : (
                                                    <MapPinIcon className="size-3.5 shrink-0" />
                                                )}

                                                <span className="truncate">
                                                    {job.isRemote
                                                        ? `Remote (${job.location})`
                                                        : job.location}
                                                </span>
                                            </p>
                                        </TableCell>

                                        {/* Job type */}
                                        <TableCell>
                                            <span className="inline-flex rounded-md bg-muted px-2.5 py-1 text-xs font-medium">
                                                {formatJobType(job.jobType)}
                                            </span>
                                        </TableCell>

                                        {/* Compensation */}
                                        <TableCell className="text-sm">
                                            {formatCompensation(job)}
                                        </TableCell>

                                        {/* Applicants */}
                                        <TableCell>
                                            <p className="flex items-center gap-1.5 text-sm">
                                                <UsersIcon className="size-4 text-muted-foreground" />
                                                {job.applicants ?? 0}
                                            </p>
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <JobStatusBadge status={status} />
                                        </TableCell>

                                        {/* Deadline */}
                                        <TableCell>
                                            <p className="text-sm font-medium">
                                                {formatDeadline(job.deadline)}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                {status === "active"
                                                    ? "Application open"
                                                    : "Closed"}
                                            </p>
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="pr-4 text-right">
                                            <div className="flex items-center justify-end gap-4">
                                                <Button
                                                    size="sm"
                                                    nativeButton={false}
                                                    render={
                                                        <Link href={`/dashboard/recruiter/jobs/${job._id}/edit`} />
                                                    }
                                                    className="bg-brand/15 text-brand-muted hover:bg-brand/25"
                                                    aria-label={`Edit ${job.title}`}
                                                >
                                                    <PencilIcon data-icon="inline-start" />
                                                </Button>

                                                <DeleteJobDialog
                                                    jobId={job._id}
                                                    jobTitle={job.title}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </section>
        </main>
    );
}
