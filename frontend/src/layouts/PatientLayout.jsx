import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function PatientLayout({ children }) {
  const links = [
    { label: "Dashboard", path: "/patient/dashboard" },
    { label: "Book Appointment", path: "/patient/book" },
    { label: "My Appointments", path: "/patient/appointments" },
    { label: "Profile", path: "/patient/profile" },
  ];
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar links={links} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
