import { Search } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

export function AdminNavbar() {
    const { user } = useAuth()

    return (
        <header className="h-16 border-b border-border bg-card flex items-center justify-end px-6 shrink-0">
            {/* Title */}


            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-input bg-background text-sm text-muted-foreground">
                    <Search className="w-3.5 h-3.5" />
                    <input
                        className="bg-transparent outline-none w-40 text-xs placeholder:text-muted-foreground"
                        placeholder="Search..."
                    />
                </div>

                {/* Theme Toggle */}
                <ThemeToggle />



                {/* Admin avatar */}
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                </div>
            </div>
        </header>
    );
}
