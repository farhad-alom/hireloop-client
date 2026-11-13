"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, CircleAlertIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    NativeSelect,
    NativeSelectOption,
} from "@/components/ui/native-select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { JobFormSection } from "@/components/jobs/JobFormSection"
import { JobTypeSelector } from "@/components/jobs/JobTypeSelector"
import { createJob, updateJob } from "@/lib/api/jobs"
import {
    JOB_CATEGORIES,
    SALARY_FREQUENCIES,
} from "@/lib/constants/jobs"
import type { JobData } from "@/types/job"

function fieldClasses() {
    return "h-10"
}

export function JobForm({ job }: { job?: JobData }) {
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const isEdit = Boolean(job?._id)

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = event.currentTarget
        setSaving(true)

        // HTML ফর্মের সাবমিট করা ডাটা ক্যাপচার করার বিল্ট-ইন FormData অবজেক্ট।
        const raw = Object.fromEntries(new FormData(form)) as Record<string, string>

        const jobData: JobData = {
            title: raw.title,
            companyName: raw.companyName,
            jobCategory: raw.jobCategory,
            department: raw.department,
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

        // On create the API needs the starting status, applicant count and
        // posting date. On edit we must not overwrite those, so we skip them.
        const request = isEdit && job?._id
            ? updateJob(job._id, jobData)
            : createJob({
                ...jobData,
                status: "active",
                applicants: 0,
                postedAt: new Date().toISOString().slice(0, 10),
            })

        request
            .then((result) => {
                const succeeded = isEdit
                    ? result.acknowledged && result.matchedCount === 1
                    : result.acknowledged

                if (succeeded) {
                    toast.add({
                        title: isEdit ? "Job updated" : "Job published",
                        description: `${jobData.title} has been ${isEdit ? "updated" : "published"} successfully.`,
                        type: "success",
                    })

                    router.push("/dashboard/recruiter/jobs")
                    router.refresh()
                } else {
                    toast.add({
                        title: isEdit ? "Update failed" : "Publish failed",
                        description: result.error || "Please check the job details and try again.",
                        type: "error",
                    })
                }
            })
            .catch(() => {
                toast.add({
                    title: isEdit ? "Update failed" : "Publish failed",
                    description: "Something went wrong while saving the job.",
                    type: "error",
                })
            })
            .finally(() => setSaving(false))
    }

    return (
        <>
            <form id="job-form" onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Basic Information */}
                <JobFormSection title="1. Basic Information">
                    <Field>
                        <FieldLabel>
                            Job Title <span className="text-brand-muted">*</span>
                        </FieldLabel>
                        <Input
                            name="title"
                            required
                            defaultValue={job?.title}
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
                                defaultValue={job?.companyName}
                                placeholder="HirePulse Network"
                                className={fieldClasses()}
                            />
                        </Field>

                        <Field>
                            <FieldLabel>
                                Department <span className="text-brand-muted">*</span>
                            </FieldLabel>
                            <Input
                                name="department"
                                required
                                defaultValue={job?.department}
                                placeholder="Web Development"
                                className={fieldClasses()}
                            />
                        </Field>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                        <Field>
                            <FieldLabel>
                                Job Category <span className="text-brand-muted">*</span>
                            </FieldLabel>
                            <NativeSelect
                                name="jobCategory"
                                required
                                defaultValue={job?.jobCategory ?? ""}
                                className={`w-full ${fieldClasses()}`}
                            >
                                <NativeSelectOption value="" disabled>
                                    Select a category
                                </NativeSelectOption>
                                {JOB_CATEGORIES.map((category) => (
                                    <NativeSelectOption key={category.value} value={category.value}>
                                        {category.label}
                                    </NativeSelectOption>
                                ))}
                            </NativeSelect>
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel>
                            Job Type <span className="text-brand-muted">*</span>
                        </FieldLabel>
                        <JobTypeSelector defaultValue={job?.jobType} />
                    </Field>
                </JobFormSection>

                {/* 2. Location, Compensation & Timeline */}
                <JobFormSection title="2. Location, Compensation & Timeline">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium">Remote Work Allowed</p>
                            <p className="text-sm text-muted-foreground">
                                Enable worldwide or distributed candidate applications
                            </p>
                        </div>
                        {/* Uncontrolled too: hidden native input submits `isRemote` */}
                        <Switch name="isRemote" defaultChecked={job?.isRemote} />
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
                                defaultValue={job?.location}
                                placeholder="New York, USA"
                                className={fieldClasses()}
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Application Deadline</FieldLabel>
                            <Input
                                name="deadline"
                                type="date"
                                defaultValue={job?.deadline?.slice(0, 10)}
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
                                defaultValue={job?.minSalary}
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
                                defaultValue={job?.maxSalary}
                                placeholder="40"
                                className={fieldClasses()}
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Frequency</FieldLabel>
                            <NativeSelect
                                name="salaryFrequency"
                                defaultValue={job?.salaryFrequency ?? "per hour"}
                                className={`w-full ${fieldClasses()}`}
                            >
                                {SALARY_FREQUENCIES.map((frequency) => (
                                    <NativeSelectOption key={frequency.value} value={frequency.value}>
                                        {frequency.label}
                                    </NativeSelectOption>
                                ))}
                            </NativeSelect>
                        </Field>
                    </div>
                </JobFormSection>

                {/* 3. Responsibilities & Requirements */}
                <JobFormSection title="3. Responsibilities & Requirements">
                    <Field>
                        <FieldLabel>
                            Key Responsibilities <span className="text-brand-muted">*</span>
                        </FieldLabel>
                        <Textarea
                            name="responsibilities"
                            required
                            rows={4}
                            defaultValue={job?.responsibilities}
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
                            defaultValue={job?.qualifications}
                            placeholder={"• 3+ years of experience with React, TypeScript, and modern state architectures\n• Solid understanding of DOM performance and component-driven designs\n• Experience partnering closely with product teams and UI/UX designers"}
                        />
                    </Field>
                </JobFormSection>
            </form>

            {/* Footer note for invalid submissions (HTML validation handles it) */}
            <p className="mt-6 flex items-center gap-2 px-1 pb-2 text-sm text-muted-foreground">
                <CircleAlertIcon className="size-4" />
                Fields marked with <span className="text-brand-muted">*</span> are required.
            </p>

            <div>
                <Button
                    type="submit"
                    form="job-form"
                    disabled={saving}
                    className="bg-brand text-brand-foreground hover:bg-brand-hover"
                >
                    {isEdit
                        ? saving ? "Saving..." : "Save Changes"
                        : saving ? "Publishing..." : "Publish Job"}
                    <ArrowRight className="size-4" />
                </Button>
            </div>
        </>
    )
}
