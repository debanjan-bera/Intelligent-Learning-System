import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, Clock, GraduationCap, LogOut, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "History", href: "/history", icon: Clock },
  ];


  return (
    <aside className={`relative border-r border-border bg-card hidden md:flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>

      {/* Toggle button */}
      {onToggle && (
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
      )}

      {/* Logo */}
      <div className={`h-16 flex items-center border-b border-border px-4 ${collapsed ? "justify-center" : "gap-3"}`}>
        <div className="bg-primary/10 p-1.5 rounded-lg shrink-0">
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
        {!collapsed && (
          <span className="font-bold text-xl tracking-tight text-foreground truncate">
            Lumina AI
          </span>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto w-full">
        {!collapsed && (
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
            Learning
          </div>
        )}

        {navigation.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (location.pathname.startsWith(item.href) && item.href !== "/");

          return (
            <Link key={item.name} to={item.href} title={collapsed ? item.name : undefined} className="block">
              <div
                className={`flex items-center gap-3 px-3 py-2.5 mb-2 rounded-lg transition-colors text-sm font-medium ${collapsed ? "justify-center" : ""}
                ${isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </div>

      {/* User */}
      <div className={`p-3 border-t border-border space-y-1 w-full`}>
        {!collapsed && (
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-2">
            Account
          </p>
        )}
        <button
          className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
        <button
          className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 transition-colors ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Logout" : undefined}
          onClick={logout}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

    </aside>
  );
}
