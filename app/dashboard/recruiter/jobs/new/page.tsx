import { Separator } from "@/components/ui/separator"

import { JobForm } from "../job-form"

export default function NewJobPage() {
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

            <JobForm />
        </div>
    )
}
