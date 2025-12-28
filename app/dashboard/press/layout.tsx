import { SidebarProvider } from "@/components/ui/sidebar";
import { ArinSidebar } from "@/components/ArinSidebar";

export default function PressLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-muted">
                <ArinSidebar />
                <main className="flex-1 overflow-auto">{children}</main>
            </div>
        </SidebarProvider>
    );
}
