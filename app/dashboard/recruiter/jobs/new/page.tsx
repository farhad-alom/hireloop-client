import { Separator } from "@/components/ui/separator"

import { JobForm } from "@/components/jobs/JobForm"
import { PageHeader } from "@/components/layout/PageHeader"

export default function NewJobPage() {
    return (
        <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
            {/* Page header */}
            <PageHeader
                breadcrumb={["Manage Jobs", "Create New Listing"]}
                title="Post New Job"
                description="Fill in the position specifications to attract qualified talent across our network."
            />

            <Separator className="my-6" />

            <JobForm />
        </div>
    )
}
