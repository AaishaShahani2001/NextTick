import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminGuard from "@/components/AdminGuard";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen flex bg-[#0b0b0b] text-white">
        <AdminSidebar />
         <div className="flex-1">
          <AdminTopbar />
          <main className="p-8">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
