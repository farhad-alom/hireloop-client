
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
    EllipsisVerticalIcon,
    GlobeIcon,
    MapPinIcon,
    PencilIcon,
    PlusIcon,
    Trash2Icon,
    UsersIcon,
    BriefcaseBusinessIcon,
    PaletteIcon,
    UsersRoundIcon,
    MegaphoneIcon,
    ChartNoAxesColumnIcon,
    HeadsetIcon,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { getJobs } from "@/lib/api/jobs";
import type { JobData } from "@/lib/actions/jobs";

import { Button } from "@/components/ui/button";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Category metadata
const categoryMeta: Record<
    string,
    { Icon: LucideIcon; accent: string; label: string }
> = {
    "engineering-tech": {
        Icon: BriefcaseBusinessIcon,
        accent: "bg-blue-500/10 text-blue-500",
        label: "Engineering",
    },
    design: {
        Icon: PaletteIcon,
        accent: "bg-purple-500/10 text-purple-500",
        label: "Design",
    },
    "human-resources": {
        Icon: UsersRoundIcon,
        accent: "bg-pink-500/10 text-pink-500",
        label: "Human Resources",
    },
    marketing: {
        Icon: MegaphoneIcon,
        accent: "bg-orange-500/10 text-orange-500",
        label: "Marketing",
    },
    "data-analytics": {
        Icon: ChartNoAxesColumnIcon,
        accent: "bg-cyan-500/10 text-cyan-500",
        label: "Data Analytics",
    },
    "customer-support": {
        Icon: HeadsetIcon,
        accent: "bg-green-500/10 text-green-500",
        label: "Customer Support",
    },
};

const defaultCategory = {
    Icon: BriefcaseBusinessIcon,
    accent: "bg-muted text-muted-foreground",
    label: "Other",
};

// Formatting helpers
function formatJobType(type: string) {
    return type
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function formatCompensation(job: JobData) {
    const min = Number(job.minSalary || 0).toLocaleString();
    const max = Number(job.maxSalary || 0).toLocaleString();

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

// Derive status from deadline
function getJobStatus(deadline: string) {
    if (!deadline) return "expired";

    const deadlineDate = new Date(deadline);

    if (Number.isNaN(deadlineDate.getTime())) return "expired";

    return deadlineDate.getTime() >= Date.now()
        ? "active"
        : "expired";
}

// Status badge
function StatusBadge({ status }: { status: string }) {
    const active = status === "active";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${active
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-muted text-muted-foreground"
                }`}
        >
            <span
                className={`size-1.5 rounded-full ${active
                    ? "bg-emerald-400"
                    : "bg-muted-foreground/60"
                    }`}
            />

            {active ? "Active" : "Expired"}
        </span>
    );
}

// Main Client Component
export default function RecruiterJobPage() {
    const [jobs, setJobs] = useState<JobData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getJobs().then((data) => {
            setJobs(data);
            setLoading(false);
        });
    }, []);

    return (
        <main className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
            {/* Page header */}
            <header>
                <p className="text-sm text-muted-foreground">
                    Manage Jobs <span className="mx-1">›</span>{" "}
                    <span className="text-brand">
                        Job Listings &amp; Postings
                    </span>
                </p>

                <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Manage Job Posts
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Review live listings, monitor applicants, and update
                            job details across your organization.
                        </p>
                    </div>

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
                </div>
            </header>

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
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="h-32 text-center text-muted-foreground"
                                >
                                    Loading jobs...
                                </TableCell>
                            </TableRow>
                        ) : jobs.length === 0 ? (
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
                                const {
                                    Icon,
                                    accent,
                                    label,
                                } = categoryMeta[job.jobCategory] || defaultCategory;

                                const jobId = `${job.title}-${index}`;
                                const status = getJobStatus(job.deadline);

                                return (
                                    <TableRow key={jobId}>
                                        {/* Job title & category */}
                                        <TableCell className="py-4 pl-4">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${accent}`}
                                                >
                                                    <Icon className="size-4" />
                                                </span>

                                                <div className="min-w-0">
                                                    <p className="font-medium">
                                                        {job.title}
                                                    </p>

                                                    <p className="text-xs text-muted-foreground">
                                                        {label}
                                                    </p>
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
                                                —
                                            </p>
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <StatusBadge status={status} />
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
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    size="sm"
                                                    className="bg-brand/15 text-brand-muted hover:bg-brand/25"
                                                    onClick={() =>
                                                        console.log("Update job:", job.title)
                                                    }
                                                >
                                                    <PencilIcon data-icon="inline-start" />
                                                    Update
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    className="text-muted-foreground hover:text-destructive"
                                                    onClick={() =>
                                                        console.log("Delete job:", job.title)
                                                    }
                                                    aria-label={`Delete ${job.title}`}
                                                >
                                                    <Trash2Icon />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    className="text-muted-foreground"
                                                    onClick={() =>
                                                        console.log("More actions:", job.title)
                                                    }
                                                    aria-label={`More actions for ${job.title}`}
                                                >
                                                    <EllipsisVerticalIcon />
                                                </Button>
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
