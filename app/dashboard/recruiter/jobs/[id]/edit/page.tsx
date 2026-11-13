import { notFound } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { JobForm } from "@/components/jobs/JobForm"
import { PageHeader } from "@/components/layout/PageHeader"
import { getJob } from "@/lib/api/jobs"

export default async function EditJobPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    if (!/^[0-9a-f]{24}$/i.test(id)) notFound()

    const fetched = await getJob(id).catch(() => "unreachable" as const)

    if (fetched === "unreachable") {
        return (
            <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
                <p className="rounded-xl bg-card p-8 text-center text-muted-foreground">
                    Could not load this job. Make sure the API server is
                    running on port 5000 (run <code>node index.js</code> in
                    the SERVER folder).
                </p>
            </div>
        )
    }

    if (!fetched) notFound()

    return (
        <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
            {/* Page header */}
            <PageHeader
                breadcrumb={["Manage Jobs", "Edit Listing"]}
                title="Edit Job"
                description={`Update the listing details for ${fetched.title} at ${fetched.companyName}.`}
            />

            <Separator className="my-6" />

            <JobForm job={fetched} />
        </div>
    )
}
