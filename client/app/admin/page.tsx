import StatCard from "@/components/admin/StatCard";

export default function AdminDashboard() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Orders" value="124" />
        <StatCard title="Total Products" value="32" />
        <StatCard title="Revenue" value="$18,450" />
      </div>
    </>
  );
}
