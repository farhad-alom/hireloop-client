"use client"

// The job details page content, following the Figma design:
// a header card with apply actions, key info cards, the
// Responsibilities / Requirements sections, and an overview sidebar.

import { useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
    BanknoteIcon,
    BookmarkIcon,
    ClockIcon,
    LayersIcon,
    MapPinIcon,
    type LucideIcon,
} from "lucide-react"

import type { JobRecord } from "@/types/job"
import { useSession } from "@/lib/auth-client"
import { applyToJob } from "@/lib/api/jobs"
import {
    getJobCategoryLabel,
    getJobLocationLabel,
    getJobTypeLabel,
} from "@/lib/constants/jobs"

/* ---------- Formatting helpers ---------- */

// Fixed "en-US" locale to avoid SSR/client hydration mismatches (like JobsTable).
const compactFormatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 0,
});

// 140000 -> "$140K", 800 -> "$800".
const formatSalary = (value: number) => `$${compactFormatter.format(Number(value || 0))}`;

const formatSalaryRange = (job: JobRecord) =>
    `${formatSalary(job.minSalary)} - ${formatSalary(job.maxSalary)}`;

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

// Splits a textarea value into bullet items, one per non-empty line.
const toListItems = (text: string) =>
    text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

/* ---------- Small pieces ---------- */

// One of the four key info cards (icon, small uppercase label, bold value).
function InfoCard({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-4">
            <Icon className="size-5" aria-hidden="true" />
            <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <p className="mt-1 font-semibold">{value}</p>
        </div>
    );
}

function BulletList({ items }: { items: string[] }) {
    return (
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {items.map((item, index) => (
                <li key={`${index}-${item}`}>{item}</li>
            ))}
        </ul>
    );
}

// A titled block inside the details card; the parent renders dividers between them.
function DetailSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="py-6 first:pt-0 last:pb-0">
            <h2 className="text-xl font-bold">{title}</h2>
            <div className="mt-4">{children}</div>
        </section>
    );
}

// A label / value row of the overview sidebar (like the Figma SIZE / INDUSTRY rows).
function OverviewRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-0 last:pb-0">
            <span className="shrink-0 text-xs uppercase tracking-wide text-muted-foreground">
                {label}
            </span>
            <span className="text-right text-sm font-medium">{value}</span>
        </div>
    );
}

/* ---------- Job details ---------- */

export function JobDetails({ job }: { job: JobRecord }) {
    // Session info from better-auth: who is logged in (if anyone).
    const { data: session, isPending: sessionLoading } = useSession();
    const router = useRouter();

    // Application states: loading the session, sending, done, or an error.
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [applyError, setApplyError] = useState("");

    const responsibilities = toListItems(job.responsibilities);
    const qualifications = toListItems(job.qualifications);
    const hasDetails = responsibilities.length > 0 || qualifications.length > 0;

    // TODO: implement — save this job for the current user.
    const handleBookmark = () => {};

    // Starts the application flow:
    // 1. Wait for the session check (we don't know yet if the user is logged in).
    // 2. Not logged in → send them to sign in and come back to this job after.
    // 3. Logged in → POST the application to the Express API.
    async function handleApply() {
        if (sessionLoading || applying || applied) return;

        if (!session) {
            // encodeURIComponent keeps the URL safe (it can contain ":" and "/").
            const backToJob = encodeURIComponent(`/browse-jobs/${job._id}`);
            router.push(`/sign-in?next=${backToJob}`);
            return;
        }

        setApplying(true);
        setApplyError("");

        const result = await applyToJob(job._id);

        setApplying(false);

        if (result.ok) {
            setApplied(true);
        } else {
            setApplyError(result.error ?? "Could not submit application");
        }
    }

    return (
        <main className="mx-auto w-full max-w-7xl p-3 md:p-5">
            {/* Header: logo, title, company and the actions */}
            <section className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-5 md:gap-5 md:p-6">
                <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-muted text-xl font-semibold md:size-16">
                    {job.companyName.charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                        {job.title}
                    </h1>
                    <p className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>{job.companyName}</span>
                        {job.department && (
                            <>
                                <span aria-hidden="true">•</span>
                                <span>{job.department}</span>
                            </>
                        )}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleBookmark}
                        aria-label="Save job"
                        className="grid size-10 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <BookmarkIcon className="size-5" />
                    </button>

                    <button
                        type="button"
                        onClick={handleApply}
                        // Disabled while the session loads, while sending, and after success.
                        disabled={sessionLoading || applying || applied}
                        className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {applied
                            ? "Applied ✓"
                            : applying
                                ? "Applying..."
                                : "Apply Now"}
                    </button>
                </div>

                {/* Application problems (not logged in errors, already applied, API down) */}
                {applyError && (
                    <p className="w-full text-sm text-destructive">{applyError}</p>
                )}
            </section>

            {/* Key info cards */}
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                <InfoCard
                    icon={BanknoteIcon}
                    label="Salary Range"
                    value={formatSalaryRange(job)}
                />
                <InfoCard
                    icon={MapPinIcon}
                    label="Location"
                    value={getJobLocationLabel(job)}
                />
                <InfoCard
                    icon={ClockIcon}
                    label="Job Type"
                    value={getJobTypeLabel(job.jobType)}
                />
                <InfoCard
                    icon={LayersIcon}
                    label="Category"
                    value={getJobCategoryLabel(job.jobCategory)}
                />
            </div>

            {/* Sections + overview sidebar */}
            <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
                {hasDetails && (
                    <section className="rounded-xl border border-border bg-card p-5 md:p-6">
                        <div className="divide-y divide-border">
                            {responsibilities.length > 0 && (
                                <DetailSection title="Responsibilities">
                                    <BulletList items={responsibilities} />
                                </DetailSection>
                            )}

                            {qualifications.length > 0 && (
                                <DetailSection title="Requirements">
                                    <BulletList items={qualifications} />
                                </DetailSection>
                            )}
                        </div>
                    </section>
                )}

                <aside className="h-fit rounded-xl border border-border bg-card p-5">
                    <h2 className="text-lg font-bold">Job Overview</h2>

                    <div className="mt-2">
                        <OverviewRow
                            label="Workplace"
                            value={job.isRemote ? "Remote" : "On-site"}
                        />
                        {job.department && (
                            <OverviewRow label="Department" value={job.department} />
                        )}
                        <OverviewRow label="Deadline" value={formatDate(job.deadline)} />
                        <OverviewRow
                            label="Posted"
                            value={formatDate(job.createdAt ?? job.postedAt)}
                        />
                    </div>
                </aside>
            </div>
        </main>
    );
}
