import { UserTable } from "@/components/admin/UserTable";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAdminContext } from "@/context/AdminContext";

export default function AdminUsers() {
    const { users } = useAdminContext();

    return (
        <AdminLayout>
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Student Management</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Monitor and manage all registered students.</p>
                </div>
                <UserTable users={users} />
            </div>
        </AdminLayout>
    );
}
