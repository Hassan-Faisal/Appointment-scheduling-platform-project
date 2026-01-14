import PatientLayout from "../../layouts/PatientLayout";
import SlotButton from "../../components/SlotButton";

export default function BookAppointment() {
  const doctors = [
    { id: 1, name: "Dr. Fahad", specialization: "Cardiologist" },
    { id: 2, name: "Dr. Ali", specialization: "Dermatologist" },
  ];

  const slots = [
    { time: "10:00 AM", available: true },
    { time: "10:30 AM", available: false },
    { time: "11:00 AM", available: true },
    { time: "11:30 AM", available: true },
  ];

  return (
    <PatientLayout>
      <h1 className="text-xl font-bold mb-4">Book Appointment</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.map((doc) => (
          <div key={doc.id} className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold">{doc.name}</h2>
            <p className="text-gray-500">{doc.specialization}</p>

            <div className="mt-4 flex flex-wrap">
              {slots.map((slot) => (
                <SlotButton key={slot.time} time={slot.time} available={slot.available} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </PatientLayout>
  );
}
