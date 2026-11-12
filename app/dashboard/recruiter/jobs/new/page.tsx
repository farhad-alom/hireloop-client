"use client"

import { ArrowRight, CircleAlertIcon } from "lucide-react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    NativeSelect,
    NativeSelectOption,
} from "@/components/ui/native-select"
import { RadioGroup } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { createJob, type JobData } from "@/lib/actions/jobs"

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const

const JOB_CATEGORIES = [
    "Engineering & Tech",
    "Design & Creative",
    "Product & Management",
    "Data & Analytics",
    "Sales & Marketing",
    "Operations",
] as const

const SALARY_FREQUENCIES = ["per hour", "per day", "per month", "per year"] as const

function SectionHeader({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-brand" />
            <h2 className="text-lg font-medium">{title}</h2>
        </div>
    )
}

function fieldClasses() {
    return "h-10"
}

export default function NewJobPage() {
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const raw = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>

        const job: JobData = {
            title: raw.title,
            companyName: raw.companyName,
            jobCategory: raw.jobCategory,
            jobType: raw.jobType,
            isRemote: raw.isRemote === "on",
            location: raw.location ?? "",
            deadline: raw.deadline ?? "",
            minSalary: Number(raw.minSalary ?? 0),
            maxSalary: Number(raw.maxSalary ?? 0),
            salaryFrequency: raw.salaryFrequency,
            responsibilities: raw.responsibilities,
            qualifications: raw.qualifications,
        }

        // TODO: POST `job` to the jobs API once the backend endpoint is ready
        console.log("New job:", job)
        event.currentTarget.reset()

        const result = await createJob(job);
        console.log('Server response', result);


    }

    return (
        <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
            {/* Page header */}
            <header>
                <p className="text-sm text-muted-foreground">
                    Manage Jobs <span className="mx-1">›</span>{" "}
                    <span className="text-brand">Create New Listing</span>
                </p>

                <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Post New Job</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Fill in the position specifications to attract qualified talent across
                            our network.
                        </p>
                    </div>

                </div>

                <Separator className="my-6" />
            </header>

            <form id="post-new-job-form" onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Basic Information */}
                <section className="rounded-xl bg-card p-5 md:p-6">
                    <SectionHeader title="1. Basic Information" />
                    <div className="mt-5 space-y-5">
                        <Field>
                            <FieldLabel>
                                Job Title <span className="text-brand-muted">*</span>
                            </FieldLabel>
                            <Input
                                name="title"
                                required
                                placeholder="Frontend Developer"
                                className={fieldClasses()}
                            />
                        </Field>

                        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                            <Field>
                                <FieldLabel>
                                    Company Name <span className="text-brand-muted">*</span>
                                </FieldLabel>
                                <Input
                                    name="companyName"
                                    required
                                    placeholder="HirePulse Network"
                                    className={fieldClasses()}
                                />
                            </Field>

                            <Field>
                                <FieldLabel>
                                    Job Category <span className="text-brand-muted">*</span>
                                </FieldLabel>
                                <NativeSelect name="jobCategory" required defaultValue="" className={`w-full ${fieldClasses()}`}>
                                    <NativeSelectOption value="" disabled>
                                        Select a category
                                    </NativeSelectOption>
                                    {JOB_CATEGORIES.map((category) => (
                                        <NativeSelectOption key={category} value={category.toLowerCase().replace(/[^a-z]+/g, "-")}>
                                            {category}
                                        </NativeSelectOption>
                                    ))}
                                </NativeSelect>
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>
                                Job Type <span className="text-brand-muted">*</span>
                            </FieldLabel>
                            <RadioGroup
                                name="jobType"
                                defaultValue="full-time"
                                className="grid grid-cols-2 gap-3 md:grid-cols-4"
                            // The radio group is uncontrolled: Base UI renders a hidden
                            // native input per item, so FormData picks up `jobType` for free.
                            >
                                {JOB_TYPES.map((jobType) => (
                                    <RadioPrimitive.Root
                                        key={jobType}
                                        value={jobType.toLowerCase()}
                                        className="flex h-10 cursor-pointer select-none items-center justify-center rounded-lg bg-muted px-2 text-sm text-muted-foreground transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-checked:border-brand data-checked:bg-card data-checked:text-foreground hover:border-ring hover:not-data-checked:text-foreground border border-transparent"
                                    >
                                        {jobType}
                                    </RadioPrimitive.Root>
                                ))}
                            </RadioGroup>
                        </Field>
                    </div>
                </section>

                {/* 2. Location, Compensation & Timeline */}
                <section className="rounded-xl bg-card p-5 md:p-6">
                    <SectionHeader title="2. Location, Compensation & Timeline" />
                    <div className="mt-5 space-y-5">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium">Remote Work Allowed</p>
                                <p className="text-sm text-muted-foreground">
                                    Enable worldwide or distributed candidate applications
                                </p>
                            </div>
                            {/* Uncontrolled too: hidden native input submits `isRemote` */}
                            <Switch name="isRemote" />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                            <Field>
                                <div className="flex w-full items-center justify-between gap-2">
                                    <FieldLabel>
                                        Job Location <span className="text-brand-muted">*</span>
                                    </FieldLabel>
                                    <span className="text-xs text-muted-foreground">Required</span>
                                </div>
                                <Input
                                    name="location"
                                    required
                                    placeholder="New York, USA"
                                    className={fieldClasses()}
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Application Deadline</FieldLabel>
                                <Input
                                    name="deadline"
                                    type="date"
                                    className={fieldClasses()}
                                />
                            </Field>
                        </div>

                        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
                            <Field>
                                <FieldLabel>Min Salary / Rate</FieldLabel>
                                <Input
                                    name="minSalary"
                                    type="number"
                                    min="0"
                                    inputMode="numeric"
                                    placeholder="25"
                                    className={fieldClasses()}
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Max Salary / Rate</FieldLabel>
                                <Input
                                    name="maxSalary"
                                    type="number"
                                    min="0"
                                    inputMode="numeric"
                                    placeholder="40"
                                    className={fieldClasses()}
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Frequency</FieldLabel>
                                <NativeSelect name="salaryFrequency" defaultValue="per hour" className={`w-full ${fieldClasses()}`}>
                                    {SALARY_FREQUENCIES.map((frequency) => (
                                        <NativeSelectOption key={frequency} value={frequency}>
                                            {frequency}
                                        </NativeSelectOption>
                                    ))}
                                </NativeSelect>
                            </Field>
                        </div>
                    </div>
                </section>

                {/* 3. Responsibilities & Requirements */}
                <section className="rounded-xl bg-card p-5 md:p-6">
                    <SectionHeader title="3. Responsibilities & Requirements" />
                    <div className="mt-5 space-y-5">
                        <Field>
                            <FieldLabel>
                                Key Responsibilities <span className="text-brand-muted">*</span>
                            </FieldLabel>
                            <Textarea
                                name="responsibilities"
                                required
                                rows={4}
                                placeholder="Showcase your commitment to delivering exceptional user interfaces and digital experiences. You will collaborate directly with systems designers and backend engineers to craft responsive, micro-interaction rich products."
                            />
                        </Field>

                        <Field>
                            <FieldLabel>
                                Qualifications &amp; Requirements <span className="text-brand-muted">*</span>
                            </FieldLabel>
                            <Textarea
                                name="qualifications"
                                required
                                rows={4}
                                placeholder={"• 3+ years of experience with React, TypeScript, and modern state architectures\n• Solid understanding of DOM performance and component-driven designs\n• Experience partnering closely with product teams and UI/UX designers"}
                            />
                        </Field>
                    </div>
                </section>

                {/* Footer note for invalid submissions (HTML validation handles it) */}
                <p className="flex items-center gap-2 px-1 pb-2 text-sm text-muted-foreground">
                    <CircleAlertIcon className="size-4" />
                    Fields marked with <span className="text-brand-muted">*</span> are required.
                </p>
            </form>

            <div>
                <Button
                    type="submit"
                    form="post-new-job-form"
                    className="bg-brand text-brand-foreground hover:bg-brand-hover"
                >
                    Publish Job <ArrowRight className="size-4" />
                </Button>

            </div>
        </div>
    )
}
