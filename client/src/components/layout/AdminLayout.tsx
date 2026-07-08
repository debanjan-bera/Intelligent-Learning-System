import { useState, type ReactNode } from "react";
import { AdminSidebar } from "../admin/layout/AdminSidebar";
import { AdminNavbar } from "../admin/layout/AdminNavbar";

interface AdminLayoutProps {
    children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="fixed inset-0 flex h-full w-full bg-background overflow-hidden">
            <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
            <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                <AdminNavbar />
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
