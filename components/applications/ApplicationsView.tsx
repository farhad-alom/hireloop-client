"use client";

// The "My Applications" table: four stat cards, a status filter and the
// applications table (job, applied date, salary, status, view action).
// It is a client component because the status filter filters the rows
// in the browser. The page (a Server Component) fetches the real data
// and passes it in as the `applications` prop.

import { useState } from "react";
import Link from "next/link";
import { GlobeIcon, MapPinIcon, Wallet } from "lucide-react";

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
import type { ApplicationWithJob } from "@/types/application";

/* ---------- Small helpers ---------- */

// The four statuses stored by the API and the labels shown to the user.
// Record<string, string> so any status string can look up a label safely.
const STATUS_LABELS: Record<string, string> = {
    pending: "Applied",
    review: "In Review",
    accepted: "Accepted",
    rejected: "Rejected",
};

// Colors for each status badge (matches the job status badge style).
const STATUS_CLASSES: Record<string, string> = {
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
const formatSalary = (value?: number) =>
    `$${compactFormatter.format(Number(value || 0))}`;

// "2026-11-10T10:00:00.000Z" -> "Nov 10, 2026"
const formatDate = (value?: string) => {
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
function ApplicationStatusBadge({ status }: { status?: string }) {
    const key = status ?? "";
    const label = STATUS_LABELS[key] ?? key ?? "Applied";
    const colors = STATUS_CLASSES[key] ?? "bg-muted text-muted-foreground";

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
function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-3xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
    );
}

// The company logo (first letter) with a remote/on-site marker.
function CompanyLogo({
    companyName,
    isRemote,
}: {
    companyName: string;
    isRemote: boolean;
}) {
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

/* ---------- View ---------- */

export function ApplicationsView({
    applications,
}: {
    applications: ApplicationWithJob[];
}) {
    // Which status the status filter shows ("all" = every status).
    const [statusFilter, setStatusFilter] = useState("all");

    // Applications left after the status filter is applied.
    const visibleApplications =
        statusFilter === "all"
            ? applications
            : applications.filter(
                  (application) => application.status === statusFilter
              );

    // Simple counts for the stat cards (from the whole list, not the filter).
    const countByStatus = (status: string) =>
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
        <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            {/* Toolbar: status filter + browse link */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold">Applications</h2>
                <div className="flex items-center gap-2">
                    <Select
                        value={statusFilter}
                        // value can be null while the select is closing;
                        // fall back to "all" so the filter never breaks.
                        onValueChange={(value) => setStatusFilter(value ?? "all")}
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
            </div>

            {/* Applications table */}
            <section className="mt-4 overflow-x-auto rounded-xl bg-card">
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
                        {/* Empty: no applications for this filter */}
                        {visibleApplications.length === 0 && (
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
                        {visibleApplications.map((application) => (
                            <TableRow
                                key={application._id ?? application.jobId}
                            >
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
                                                        application.job.isRemote
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
                                                This job is no longer available.
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
                                        // Renders a Link, not a <button>,
                                        // so Base UI needs nativeButton={false}
                                        // (same pattern as JobsTable).
                                        nativeButton={false}
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
        </>
    );
}
