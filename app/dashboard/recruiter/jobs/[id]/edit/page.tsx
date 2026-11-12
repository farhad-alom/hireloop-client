import { notFound } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { getJob } from "@/lib/api/jobs"

import { JobForm } from "../../job-form"

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
            <header>
                <p className="text-sm text-muted-foreground">
                    Manage Jobs <span className="mx-1">›</span>{" "}
                    <span className="text-brand">Edit Listing</span>
                </p>

                <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Job</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Update the listing details for {fetched.title} at {fetched.companyName}.
                        </p>
                    </div>
                </div>

                <Separator className="my-6" />
            </header>

            <JobForm job={fetched} />
        </div>
    )
}
