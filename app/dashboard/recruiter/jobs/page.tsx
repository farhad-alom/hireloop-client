"use client"

import Link from "next/link"
import {
    EllipsisVerticalIcon,
    GlobeIcon,
    MapPinIcon,
    PencilIcon,
    PlusIcon,
    Trash2Icon,
    UsersIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DUMMY_JOB_POSTS,
    formatCompensation,
    formatDeadline,
    formatJobType,
    getCategoryMeta,
    type JobPost,
} from "@/lib/jobs"

function StatusBadge({ status }: { status: JobPost["status"] }) {
    if (status === "active") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
                Active
            </span>
        )
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-muted-foreground/60" />
            Expired
        </span>
    )
}

export default function ManageJobsPage() {
    // TODO: fetch real job posts from the API; actions below are stubs for now
    const jobs = DUMMY_JOB_POSTS

    return (
        <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
            {/* Page header */}
            <header>
                <p className="text-sm text-muted-foreground">
                    Manage Jobs <span className="mx-1">›</span>{" "}
                    <span className="text-brand">Job Listings &amp; Postings</span>
                </p>

                <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Manage Job Posts</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Review live listings, monitor applicants, and update job details across
                            your organization.
                        </p>
                    </div>

                    <Button
                        nativeButton={false}
                        render={<Link href="/dashboard/recruiter/jobs/new" />}
                        className="bg-brand text-brand-foreground hover:bg-brand-hover"
                    >
                        <PlusIcon data-icon="inline-start" />
                        New Job Post
                    </Button>

                </div>
            </header>

            {/* Job posts table */}
            <section className="mt-6 rounded-xl bg-card overflow-hidden">
                <Table className="min-w-272">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="h-11 px-4 text-xs tracking-wider text-muted-foreground uppercase">
                                Job Title &amp; Dept
                            </TableHead>
                            <TableHead className="text-xs tracking-wider text-muted-foreground uppercase">
                                Company &amp; Location
                            </TableHead>
                            <TableHead className="text-xs tracking-wider text-muted-foreground uppercase">
                                Type
                            </TableHead>
                            <TableHead className="text-xs tracking-wider text-muted-foreground uppercase">
                                Compensation
                            </TableHead>
                            <TableHead className="text-xs tracking-wider text-muted-foreground uppercase">
                                Applicants
                            </TableHead>
                            <TableHead className="text-xs tracking-wider text-muted-foreground uppercase">
                                Status
                            </TableHead>
                            <TableHead className="text-xs tracking-wider text-muted-foreground uppercase">
                                Deadline
                            </TableHead>
                            <TableHead className="text-right text-xs tracking-wider text-muted-foreground uppercase">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {jobs.map((job) => {
                            const { Icon, accent, label } = getCategoryMeta(job.jobCategory)
                            const department = job.department ?? label
                            return (
                                <TableRow key={job.id}>
                                    {/* Job title & dept */}
                                    <TableCell className="py-4 pl-4">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${accent}`}
                                            >
                                                <Icon className="size-4" />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="font-medium">{job.title}</p>
                                                <p className="text-xs">{department}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Company & location */}
                                    <TableCell>
                                        <p className="font-medium">{job.companyName}</p>
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

                                    {/* Type */}
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
                                            {job.applicants} Candidates
                                        </p>
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <StatusBadge status={job.status} />
                                    </TableCell>

                                    {/* Deadline */}
                                    <TableCell>
                                        <p className="text-sm font-medium">
                                            {formatDeadline(job.deadline)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {job.status === "active"
                                                ? `Posted ${job.postedAt}`
                                                : "Closed"}
                                        </p>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="pr-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                size="sm"
                                                className="bg-brand/15 text-brand-muted hover:bg-brand/25"
                                                onClick={() => {
                                                    // TODO: navigate to the update job page
                                                    console.log("Update job:", job.id)
                                                }}
                                            >
                                                <PencilIcon data-icon="inline-start" />
                                                Update
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                className="text-muted-foreground hover:text-destructive"
                                                onClick={() => {
                                                    // TODO: call the delete job API
                                                    console.log("Delete job:", job.id)
                                                }}
                                                aria-label={`Delete ${job.title}`}
                                            >
                                                <Trash2Icon />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                className="text-muted-foreground"
                                                onClick={() => {
                                                    // TODO: open row actions menu
                                                    console.log("More actions:", job.id)
                                                }}
                                                aria-label={`More actions for ${job.title}`}
                                            >
                                                <EllipsisVerticalIcon />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </section>
        </div>
    )
}
