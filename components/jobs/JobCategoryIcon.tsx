// The colored icon shown next to a job's category.
// The mapping lives here so the form values (lib/constants/jobs.ts)
// and the table always match.

import type { LucideIcon } from "lucide-react";
import {
    BriefcaseBusinessIcon,
    ChartNoAxesColumnIcon,
    HeadsetIcon,
    MegaphoneIcon,
    PaletteIcon,
    UsersRoundIcon,
} from "lucide-react";

const categoryMeta: Record<string, { Icon: LucideIcon; accent: string }> = {
    engineering: {
        Icon: BriefcaseBusinessIcon,
        accent: "bg-blue-500/10 text-blue-500",
    },
    "design-creative": {
        Icon: PaletteIcon,
        accent: "bg-purple-500/10 text-purple-500",
    },
    "product-management": {
        Icon: UsersRoundIcon,
        accent: "bg-pink-500/10 text-pink-500",
    },
    "data-analytics": {
        Icon: ChartNoAxesColumnIcon,
        accent: "bg-cyan-500/10 text-cyan-500",
    },
    "sales-marketing": {
        Icon: MegaphoneIcon,
        accent: "bg-orange-500/10 text-orange-500",
    },
    operations: {
        Icon: HeadsetIcon,
        accent: "bg-green-500/10 text-green-500",
    },
};

const defaultMeta = {
    Icon: BriefcaseBusinessIcon,
    accent: "bg-muted text-muted-foreground",
};

export function JobCategoryIcon({ category }: { category: string }) {
    const { Icon, accent } = categoryMeta[category] || defaultMeta;

    return (
        <span
            className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${accent}`}
        >
            <Icon className="size-4" />
        </span>
    );
}
