

// import { useEffect, useState } from "react";
// import PatientLayout from "../../layouts/PatientLayout";
// import AppointmentTable from "../../components/AppointmentTable";
// import {
//   getMyUpcomingAppointments,
//   getMyAppointmentHistory,
//   cancelAppointment,
// } from "../../api/patient";

// export default function MyAppointments() {
//   const [appointments, setAppointments] = useState([]);

//   const loadAppointments = async () => {
//     const [upcoming, history] = await Promise.all([
//       getMyUpcomingAppointments(),
//       getMyAppointmentHistory(),
//     ]);

//     // Log data for debugging
//     console.log("Upcoming Appointments:", upcoming.data);
//     console.log("History Appointments:", history.data);

//     // Combine upcoming and history appointments and set the state
//     setAppointments([...upcoming.data, ...history.data]);
//   };

//   useEffect(() => {
//     loadAppointments();
//   }, []);

//   return (
//     <PatientLayout>
//       <h1 className="text-xl font-bold mb-4">My Appointments</h1>

//       {/* Minimal styling for debugging */}
//       <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
//         <AppointmentTable
//           data={appointments}
//           role="patient"
//           onCancel={cancelAppointment}
//         />
//       </div>
//     </PatientLayout>
//   );
// }


import { useEffect, useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import AppointmentTable from "../../components/AppointmentTable";
import {
  getMyUpcomingAppointments,
  getMyAppointmentHistory,
  cancelAppointment,
} from "../../api/patient";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);

  const loadAppointments = async () => {
    const [upcoming, history] = await Promise.all([
      getMyUpcomingAppointments(),
      getMyAppointmentHistory(),
    ]);

    // Log data for debugging
    console.log("Upcoming Appointments:", upcoming.data);
    console.log("History Appointments:", history.data);

    // Combine upcoming and history appointments and set the state
    setAppointments([...upcoming.data, ...history.data]);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // Function to handle appointment cancellation
  const handleCancel = async (appointmentId) => {
    try {
      await cancelAppointment(appointmentId); // Ensure this sends the correct appointment ID to the backend
      alert("Appointment canceled successfully");
      loadAppointments(); // Reload the appointments after cancellation
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("Failed to cancel appointment");
    }
  };

  return (
    <PatientLayout>
      <h1 className="text-xl font-bold mb-4">My Appointments</h1>

      {/* Minimal styling for debugging */}
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <AppointmentTable
          data={appointments}
          role="patient"
          onCancel={handleCancel} // Use the handleCancel function here
        />
      </div>
    </PatientLayout>
  );
}
