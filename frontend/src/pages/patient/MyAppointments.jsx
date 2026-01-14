import PatientLayout from "../../layouts/PatientLayout";
import AppointmentTable from "../../components/AppointmentTable";

export default function MyAppointments() {
  const data = [
    {
      id: 1,
      doctorName: "Dr. Fahad",
      date: "2026-01-15",
      time: "10:00 AM",
      status: "booked",
    },
    {
      id: 2,
      doctorName: "Dr. Ali",
      date: "2026-01-10",
      time: "12:00 PM",
      status: "completed",
    },
  ];

  return (
    <PatientLayout>
      <h1 className="text-xl font-bold mb-4">My Appointments</h1>
      <AppointmentTable data={data} role="patient" />
    </PatientLayout>
  );
}
