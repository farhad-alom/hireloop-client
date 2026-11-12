
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { deleteJob } from "@/lib/actions/jobs";

interface DeleteJobDialogProps {
    jobId: string;
    jobTitle: string;
}

export function DeleteJobDialog({ jobId, jobTitle }: DeleteJobDialogProps) {
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    function handleDelete() {
        setDeleting(true);
        console.log("Deleting job:", { jobId, jobTitle });

        deleteJob(jobId)
            .then((result) => {
                if (result.deletedCount === 1) {
                    toast.add({
                        title: "Job deleted",
                        description: `${jobTitle} has been removed successfully.`,
                        type: "success",
                    });

                    setOpen(false);
                    router.refresh();
                } else {
                    toast.add({
                        title: "Delete failed",
                        description: result.error || "The job could not be deleted.",
                        type: "error",
                    });
                }
            })
            .catch(() => {
                toast.add({
                    title: "Delete failed",
                    description: "Something went wrong while deleting the job.",
                    type: "error",
                });
            })
            .finally(() => setDeleting(false));
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Delete ${jobTitle}`}
                    >
                        <Trash2Icon />
                    </Button>
                }
            />

            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20">
                        <Trash2Icon />
                    </AlertDialogMedia>

                    <AlertDialogTitle>
                        Delete Job?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Are you sure you want to permanently delete
                        <strong> {jobTitle}</strong>? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline" disabled={deleting}>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? "Deleting..." : "Confirm Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
