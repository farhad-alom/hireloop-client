import {
    ChartColumnIcon,
    CodeIcon,
    MegaphoneIcon,
    PaletteIcon,
    SettingsIcon,
    TrendingUpIcon,
    type LucideIcon,
} from "lucide-react"

import type { JobData } from "@/lib/actions/jobs"

export type { JobData }

/** A job post as shown in the recruiter "Manage Job Posts" table. */
export type JobPost = JobData & {
    id: string
    status: "active" | "expired"
    applicants: number
    /** e.g. "4d ago" — rendered as "Posted 4d ago" under the deadline. */
    postedAt: string
    /** Optional department label override (e.g. "Infrastructure", "Quality"). */
    department?: string
}

/* ---------- Display helpers ---------- */

const FREQUENCY_UNITS: Record<string, string> = {
    "per hour": "hr",
    "per day": "day",
    "per month": "mo",
    "per year": "yr",
}

export function formatCompensation(job: Pick<JobData, "minSalary" | "maxSalary" | "salaryFrequency">) {
    const isYearly = job.salaryFrequency === "per year"
    const min = isYearly ? `${job.minSalary}k` : `${job.minSalary}`
    const max = isYearly ? `${job.maxSalary}k` : `${job.maxSalary}`
    const unit = FREQUENCY_UNITS[job.salaryFrequency] ?? job.salaryFrequency
    return `€${min} – €${max} / ${unit}`
}

export function formatDeadline(deadline: string) {
    if (!deadline) return "—"
    const date = new Date(deadline)
    if (Number.isNaN(date.getTime())) return deadline
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function formatJobType(jobType: string) {
    return jobType.charAt(0).toUpperCase() + jobType.slice(1)
}

/* ---------- Category metadata (icon + accent, shared by table cells) ---------- */

type CategoryMeta = {
    label: string
    Icon: LucideIcon
    /** Classes for the icon box background/icon color. */
    accent: string
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
    "engineering-tech": {
        label: "Engineering",
        Icon: CodeIcon,
        accent: "bg-brand/10 text-brand-muted",
    },
    "design-creative": {
        label: "Design",
        Icon: PaletteIcon,
        accent: "bg-orange-500/10 text-orange-400",
    },
    "product-management": {
        label: "Product",
        Icon: SettingsIcon,
        accent: "bg-sky-500/10 text-sky-400",
    },
    "data-analytics": {
        label: "Data",
        Icon: ChartColumnIcon,
        accent: "bg-emerald-500/10 text-emerald-400",
    },
    "sales-marketing": {
        label: "Marketing",
        Icon: MegaphoneIcon,
        accent: "bg-muted text-foreground",
    },
    operations: {
        label: "Operations",
        Icon: TrendingUpIcon,
        accent: "bg-rose-500/10 text-rose-400",
    },
}

export function getCategoryMeta(jobCategory: string): CategoryMeta {
    return (
        CATEGORY_META[jobCategory] ?? {
            label: jobCategory || "—",
            Icon: SettingsIcon,
            accent: "bg-muted text-foreground",
        }
    )
}

/* ---------- Dummy data (replace with API data later) ---------- */

export const DUMMY_JOB_POSTS: JobPost[] = [
    {
        id: "job-001",
        title: "Frontend Developer",
        companyName: "HirePulse Network",
        jobCategory: "engineering-tech",
        department: "Engineering",
        jobType: "full-time",
        isRemote: true,
        location: "New York, USA",
        deadline: "2025-05-30",
        minSalary: 25,
        maxSalary: 40,
        salaryFrequency: "per hour",
        responsibilities:
            "Deliver responsive, micro-interaction rich interfaces alongside designers and backend engineers.",
        qualifications:
            "3+ years of experience with React, TypeScript, and modern state architectures.",
        status: "active",
        applicants: 34,
        postedAt: "4d ago",
    },
    {
        id: "job-002",
        title: "Senior Product Designer",
        companyName: "HirePulse Labs",
        jobCategory: "design-creative",
        department: "Design",
        jobType: "full-time",
        isRemote: false,
        location: "London, UK (Hybrid)",
        deadline: "2025-06-14",
        minSalary: 90,
        maxSalary: 115,
        salaryFrequency: "per year",
        responsibilities: "Lead end-to-end product design from discovery to polished handoff.",
        qualifications: "Strong portfolio of component-driven design systems and UX flows.",
        status: "active",
        applicants: 19,
        postedAt: "1w ago",
    },
    {
        id: "job-003",
        title: "DevOps Specialist",
        companyName: "HirePulse Platform",
        jobCategory: "engineering-tech",
        department: "Infrastructure",
        jobType: "full-time",
        isRemote: false,
        location: "Berlin, Germany",
        deadline: "2025-06-30",
        minSalary: 95,
        maxSalary: 120,
        salaryFrequency: "per year",
        responsibilities: "Own CI/CD pipelines, infrastructure as code, and observability.",
        qualifications: "Experience with Kubernetes, Terraform, and cloud platforms.",
        status: "active",
        applicants: 12,
        postedAt: "2w ago",
    },
    {
        id: "job-004",
        title: "Product Marketing Lead",
        companyName: "HirePulse Network",
        jobCategory: "sales-marketing",
        department: "Marketing",
        jobType: "full-time",
        isRemote: true,
        location: "EU/US",
        deadline: "2025-07-15",
        minSalary: 80,
        maxSalary: 105,
        salaryFrequency: "per year",
        responsibilities: "Own positioning, launch playbooks, and lifecycle campaigns.",
        qualifications: "5+ years in B2B product marketing with launch experience.",
        status: "active",
        applicants: 27,
        postedAt: "5d ago",
    },
    {
        id: "job-005",
        title: "QA Automation Engineer",
        companyName: "HirePulse Platform",
        jobCategory: "engineering-tech",
        department: "Quality",
        jobType: "part-time",
        isRemote: false,
        location: "Dublin, Ireland (Hybrid)",
        deadline: "2025-05-01",
        minSalary: 35,
        maxSalary: 50,
        salaryFrequency: "per hour",
        responsibilities: "Build and maintain automated end-to-end test suites.",
        qualifications: "Experience with Playwright or Cypress in CI pipelines.",
        status: "expired",
        applicants: 8,
        postedAt: "",
    },
]
