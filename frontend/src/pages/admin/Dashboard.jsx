import AdminLayout from "../../layouts/AdminLayout";
import StatCard from "../../components/StatCard";

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="grid grid-cols-4 gap-6">
        <StatCard title="Doctors" value="12" />
        <StatCard title="Patients" value="340" />
        <StatCard title="Appointments" value="120" />
        <StatCard title="No Shows" value="15" />
      </div>
    </AdminLayout>
  );
}
