import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/DashboardSidebar";

const DahsboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <main className="min-h-screen min-w-0 flex-1">
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    )
};

export default DahsboardLayout;