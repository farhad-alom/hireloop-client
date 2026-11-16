"use client";

// The job seeker's "My Applications" page (see the Figma design):
// a header with a status filter, four stat cards, and a table of the
// user's applications (job, applied date, salary, status, view action).
//
// DUMMY DATA: the page currently shows dummy applications so the UI can
// be reviewed before real data exists. Once applications are saved from
// the Job Details page, flip USE_DUMMY_DATA to false to load the real
// ones from the Express API (GET /applications/my).

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlobeIcon, MapPinIcon, Wallet } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getMyApplications } from "@/lib/api/applications";

/* ---------- Dummy data (temporary) ---------- */

const USE_DUMMY_DATA = true;

const DUMMY_APPLICATIONS = [
    {
        _id: "dummy-1",
        jobId: "dummy-job-1",
        status: "pending",
        appliedAt: "2026-11-10T10:00:00.000Z",
        job: {
            title: "Senior Product Designer",
            companyName: "CloudHike",
            location: "Remote",
            isRemote: true,
            jobType: "full-time",
            minSalary: 90000,
            maxSalary: 120000,
        },
    },
    {
        _id: "dummy-2",
        jobId: "dummy-job-2",
        status: "review",
        appliedAt: "2026-11-05T10:00:00.000Z",
        job: {
            title: "Lead Frontend Engineer",
            companyName: "Nova Pay",
            location: "Berlin, Germany",
            isRemote: false,
            jobType: "full-time",
            minSalary: 75000,
            maxSalary: 95000,
        },
    },
    {
        _id: "dummy-3",
        jobId: "dummy-job-3",
        status: "accepted",
        appliedAt: "2026-10-28T10:00:00.000Z",
        job: {
            title: "UX Researcher",
            companyName: "Loop Labs",
            location: "Remote",
            isRemote: true,
            jobType: "contract",
            minSalary: 60000,
            maxSalary: 80000,
        },
    },
    {
        _id: "dummy-4",
        jobId: "dummy-job-4",
        status: "rejected",
        appliedAt: "2026-10-20T10:00:00.000Z",
        job: {
            title: "Machine Learning Engineer",
            companyName: "DataForge",
            location: "Dhaka, Bangladesh",
            isRemote: false,
            jobType: "full-time",
            minSalary: 55000,
            maxSalary: 70000,
        },
    },
    {
        _id: "dummy-5",
        jobId: "dummy-job-5",
        status: "pending",
        appliedAt: "2026-11-14T10:00:00.000Z",
        job: {
            title: "Full Stack Developer",
            companyName: "Orbit Soft",
            location: "Remote",
            isRemote: true,
            jobType: "part-time",
            minSalary: 40000,
            maxSalary: 55000,
        },
    },
];

/* ---------- Small helpers ---------- */

// The four statuses stored by the API and the labels shown to the user.
const STATUS_LABELS = {
    pending: "Applied",
    review: "In Review",
    accepted: "Accepted",
    rejected: "Rejected",
};

// Colors for each status badge (matches the job status badge style).
const STATUS_CLASSES = {
    pending: "bg-sky-500/10 text-sky-400",
    review: "bg-amber-500/10 text-amber-400",
    accepted: "bg-emerald-500/10 text-emerald-400",
    rejected: "bg-red-500/10 text-red-400",
};

// Fixed "en-US" locale so the server render and the browser
// always print the same numbers and dates (no hydration mismatch).
const compactFormatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 0,
});

// 90000 -> "$90K"
const formatSalary = (value) =>
    `$${compactFormatter.format(Number(value || 0))}`;

// "2026-11-10T10:00:00.000Z" -> "Nov 10, 2026"
const formatDate = (value) => {
    if (!value) return "Not specified";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

// A status pill, e.g. a green "Applied" chip.
function ApplicationStatusBadge({ status }) {
    const label = STATUS_LABELS[status] ?? status ?? "Applied";
    const colors = STATUS_CLASSES[status] ?? "bg-muted text-muted-foreground";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${colors}`}
        >
            <span className="size-1.5 rounded-full bg-current" />
            {label}
        </span>
    );
}

// One of the four stat cards above the table.
function StatCard({ label, value }) {
    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-3xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
    );
}

// The company logo (first letter) with a remote/on-site marker.
function CompanyLogo({ companyName, isRemote }) {
    return (
        <div className="relative shrink-0">
            <div className="grid size-10 place-items-center rounded-lg bg-muted text-base font-semibold">
                {companyName.charAt(0)}
            </div>
            {isRemote && (
                <span
                    aria-label="Remote job"
                    className="absolute -right-1 -bottom-1 grid size-4 place-items-center rounded-full bg-brand text-white"
                >
                    <GlobeIcon className="size-2.5" />
                </span>
            )}
        </div>
    );
}

/* ---------- Page ---------- */

export default function SeekerApplicationPage() {
    // applications = the list shown in the table.
    const [applications, setApplications] = useState([]);
    // "loading" -> "success" (with or without rows) -> "error".
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Which status the status filter shows ("all" = every status).
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        // Dummy mode: show the sample rows right away.
        if (USE_DUMMY_DATA) {
            setApplications(DUMMY_APPLICATIONS);
            setLoading(false);
            return;
        }

        // Real mode: load the user's applications from the API.
        getMyApplications().then((result) => {
            if (result.ok) {
                setApplications(result.applications);
            } else {
                setError(result.error ?? "Could not load applications");
            }
            setLoading(false);
        });
    }, []);

    // Applications left after the status filter is applied.
    const visibleApplications =
        statusFilter === "all"
            ? applications
            : applications.filter(
                  (application) => application.status === statusFilter
              );

    // Simple counts for the stat cards (from the whole list, not the filter).
    const countByStatus = (status) =>
        applications.filter(
            (application) => application.status === status
        ).length;

    const stats = [
        { label: "Total Applications", value: applications.length },
        { label: "In Review", value: countByStatus("review") },
        { label: "Accepted", value: countByStatus("accepted") },
        { label: "Rejected", value: countByStatus("rejected") },
    ];

    return (
        <main className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
            {/* Page header + actions */}
            <PageHeader
                breadcrumb={["Dashboard", "My Applications"]}
                title="My Applications"
                description="Track the status of every job you applied for and follow each application from submission to decision."
            >
                <div className="flex items-center gap-2">
                    <Select
                        value={statusFilter}
                        onValueChange={(value) => setStatusFilter(value)}
                    >
                        <SelectTrigger className="w-40 bg-card">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {Object.keys(STATUS_LABELS).map((status) => (
                                <SelectItem key={status} value={status}>
                                    {STATUS_LABELS[status]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        nativeButton={false}
                        render={<Link href="/browse-jobs" />}
                        className="bg-brand text-brand-foreground hover:bg-brand-hover"
                    >
                        Browse Jobs
                    </Button>
                </div>
            </PageHeader>

            {/* Stat cards */}
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            {/* Applications table */}
            <section className="mt-6 overflow-x-auto rounded-xl bg-card">
                <Table className="min-w-192">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            {[
                                "Job",
                                "Applied On",
                                "Salary",
                                "Status",
                                "Action",
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
                        {/* Loading: simple placeholder rows */}
                        {loading &&
                            [0, 1, 2].map((row) => (
                                <TableRow key={row}>
                                    <TableCell colSpan={5} className="py-5">
                                        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                                    </TableCell>
                                </TableRow>
                            ))}

                        {/* Error: the API could not be reached */}
                        {!loading && error && (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-32 text-center text-destructive"
                                >
                                    {error}
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Empty: no applications for this filter */}
                        {!loading &&
                            !error &&
                            visibleApplications.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-32 text-center text-muted-foreground"
                                    >
                                        {applications.length === 0
                                            ? "You have not applied to any jobs yet."
                                            : "No applications with this status."}
                                    </TableCell>
                                </TableRow>
                            )}

                        {/* Data: one row per application */}
                        {!loading &&
                            !error &&
                            visibleApplications.map((application) => (
                                <TableRow key={application._id ?? application.jobId}>
                                    {/* Job title, company and workplace */}
                                    <TableCell className="py-4 pl-4">
                                        <div className="flex items-center gap-3">
                                            {application.job ? (
                                                <>
                                                    <CompanyLogo
                                                        companyName={
                                                            application.job
                                                                .companyName
                                                        }
                                                        isRemote={
                                                            application.job
                                                                .isRemote
                                                        }
                                                    />
                                                    <div className="min-w-0">
                                                        <Link
                                                            href={`/browse-jobs/${application.jobId}`}
                                                            className="font-medium transition-colors hover:text-brand-muted"
                                                        >
                                                            {
                                                                application.job
                                                                    .title
                                                            }
                                                        </Link>
                                                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            {application.job
                                                                .isRemote ? (
                                                                <GlobeIcon className="size-3.5 shrink-0" />
                                                            ) : (
                                                                <MapPinIcon className="size-3.5 shrink-0" />
                                                            )}
                                                            <span className="truncate">
                                                                {
                                                                    application
                                                                        .job
                                                                        .companyName
                                                                }
                                                            </span>
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                // The job was deleted after applying.
                                                <p className="text-sm text-muted-foreground">
                                                    This job is no longer
                                                    available.
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>

                                    {/* Applied date */}
                                    <TableCell className="text-sm">
                                        {formatDate(application.appliedAt)}
                                    </TableCell>

                                    {/* Salary */}
                                    <TableCell className="text-sm">
                                        {application.job ? (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Wallet
                                                    className="size-4 text-muted-foreground"
                                                    aria-hidden="true"
                                                />
                                                {formatSalary(
                                                    application.job.minSalary
                                                )}{" "}
                                                -{" "}
                                                {formatSalary(
                                                    application.job.maxSalary
                                                )}
                                            </span>
                                        ) : (
                                            "—"
                                        )}
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <ApplicationStatusBadge
                                            status={application.status}
                                        />
                                    </TableCell>

                                    {/* Action: open the job page */}
                                    <TableCell className="pr-4 text-right">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            render={
                                                <Link
                                                    href={`/browse-jobs/${application.jobId}`}
                                                />
                                            }
                                            className="text-brand-muted hover:bg-brand/15 hover:text-brand-muted"
                                        >
                                            View Job
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </section>
        </main>
    );
}
