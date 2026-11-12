"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import {
    Banknote,
    Bookmark,
    Briefcase,
    Building2,
    CirclePlus,
    FileText,
    LayoutGrid,
    Settings,
    Users,
    type LucideIcon,
} from "lucide-react"
import Link from "next/link";

type MenuItem = {
    id: string
    name: string
    url: string
    icon: LucideIcon
}

const menuItemByRole: Record<"seeker" | "recruiter" | "admin", MenuItem[]> = {
    seeker: [
        { id: "dashboard", name: "Dashboard", url: "/dashboard/seeker", icon: LayoutGrid },
        { id: "jobs", name: "Jobs", url: "/dashboard/seeker/jobs", icon: Briefcase },
        { id: "saved-jobs", name: "Saved Jobs", url: "/dashboard/seeker/saved-jobs", icon: Bookmark },
        { id: "applications", name: "Applications", url: "/dashboard/seeker/applications", icon: FileText },
        { id: "billing", name: "Billing", url: "/dashboard/seeker/billing", icon: Banknote },
        { id: "settings", name: "Settings", url: "/dashboard/seeker/settings", icon: Settings },
    ],
    recruiter: [
        { id: "dashboard", name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutGrid },
        { id: "add-job", name: "Add Job", url: "/dashboard/recruiter/jobs/new", icon: CirclePlus },
        { id: "manage-jobs", name: "Manage Jobs", url: "/dashboard/recruiter/jobs", icon: Briefcase },
        { id: "applications", name: "Applications", url: "/dashboard/recruiter/applications", icon: FileText },
        { id: "settings", name: "Settings", url: "/dashboard/recruiter/settings", icon: Settings },
    ],
    admin: [
        { id: "dashboard", name: "Dashboard", url: "/dashboard/admin", icon: LayoutGrid },
        { id: "users", name: "Users", url: "/dashboard/admin/users", icon: Users },
        { id: "companies", name: "Companies", url: "/dashboard/admin/companies", icon: Building2 },
        { id: "jobs", name: "Jobs", url: "/dashboard/admin/jobs", icon: Briefcase },
        { id: "payments", name: "Payments", url: "/dashboard/admin/payments", icon: Banknote },
        { id: "settings", name: "Settings", url: "/dashboard/admin/settings", icon: Settings },
    ]
}

export function DashboardSidebar() {
    const { data: session, } = useSession();
    const role = (session?.user?.role || 'seeker') as keyof typeof menuItemByRole;


    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />

                <SidebarGroup>
                    <SidebarMenu>
                        {/* menuItemByRole[role] হলো Dynamic Object Access */}
                        {
                            menuItemByRole[role].map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton render={<Link href={item.url} />}>
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))
                        }
                    </SidebarMenu>
                </SidebarGroup>


            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}