import DoctorLayout from "../../layouts/DoctorLayout";
import StatCard from "../../components/StatCard";

export default function Dashboard() {
  return (
    <DoctorLayout>
      <div className="grid grid-cols-3 gap-6">
        <StatCard title="Today Patients" value="8" />
        <StatCard title="Completed" value="5" />
        <StatCard title="No Shows" value="1" />
      </div>
    </DoctorLayout>
  );
}
