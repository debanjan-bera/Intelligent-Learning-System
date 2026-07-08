import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    Settings,
    LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    { label: "Courses", href: "/admin/courses", icon: BookOpen },
    { label: "Students", href: "/admin/students", icon: Users },
];

interface AdminSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
    const location = useLocation();
    const { logout } = useAuth();
    const isActive = (href: string, exact?: boolean) =>
        exact ? location.pathname === href : location.pathname.startsWith(href);

    return (
        <aside
            className={`relative flex flex-col border-r border-border bg-card transition-all duration-300 ${collapsed ? "w-16" : "w-60"
                }`}
        >
            {/* Logo */}
            <div className={`h-16 flex items-center border-b border-border px-4 ${collapsed ? "justify-center" : "gap-3"}`}>
                <div className="bg-primary/10 p-1.5 rounded-lg shrink-0">
                    <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                {!collapsed && (
                    <span className="font-bold text-foreground text-base tracking-tight truncate">
                        Lumina <span className="text-primary">Admin</span>
                    </span>
                )}
            </div>

            {/* Toggle button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-[4.5rem] z-10 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors shadow-sm"
            >
                {collapsed ? (
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                ) : (
                    <ChevronLeft className="w-3 h-3 text-muted-foreground" />
                )}
            </button>

            {/* Nav section */}
            <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {!collapsed && (
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-3">
                        Management
                    </p>
                )}
                {navItems.map((item) => {
                    const active = isActive(item.href, item.exact);
                    return (
                        <Link key={item.href} to={item.href} title={collapsed ? item.label : undefined}>
                            <div
                                className={`flex items-center gap-3 px-2.5 py-2.5 mb-2 rounded-lg transition-all duration-150 text-sm font-medium ${active
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    } ${collapsed ? "justify-center" : ""}`}
                            >
                                <item.icon className="h-4 w-4 shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Bottom */}
            <div className={`p-3 border-t border-border space-y-1`}>
                {!collapsed && (
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-2">
                        Account
                    </p>
                )}
                <button
                    className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors ${collapsed ? "justify-center" : ""
                        }`}
                    title={collapsed ? "Settings" : undefined}
                >
                    <Settings className="h-4 w-4 shrink-0" />
                    {!collapsed && "Settings"}
                </button>
                <button
                    className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 transition-colors ${collapsed ? "justify-center" : ""
                        }`}
                    onClick={logout}
                    title={collapsed ? "Logout" : undefined}
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    {!collapsed && "Logout"}
                </button>
            </div>
        </aside>
    );
}
