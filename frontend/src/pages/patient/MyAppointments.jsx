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

//   // Function to handle appointment cancellation
//   const handleCancel = async (appointmentId) => {
//     try {
//       await cancelAppointment(appointmentId); // Ensure this sends the correct appointment ID to the backend
//       alert("Appointment canceled successfully");
//       loadAppointments(); // Reload the appointments after cancellation
//     } catch (error) {
//       console.error("Error canceling appointment:", error);
//       alert("Failed to cancel appointment");
//     }
//   };

//   return (
//     <PatientLayout>
//       <h1 className="text-xl font-bold mb-4">My Appointments</h1>

//       {/* Minimal styling for debugging */}
//       <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
//         <AppointmentTable
//           data={appointments}
//           role="patient"
//           onCancel={handleCancel} // Use the handleCancel function here
//         />
//       </div>
//     </PatientLayout>
//   );
// }

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import PatientLayout from "../../layouts/PatientLayout";
import { getMyUpcomingAppointments, getMyAppointmentHistory, cancelAppointment } from "../../api/patient";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

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
      toast.success("Appointment canceled successfully");
      loadAppointments(); // Reload the appointments after cancellation
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };

  return (
    <PatientLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">My Appointments</h1>
          <p className="text-gray-500">View and manage your appointments</p>
        </motion.div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center"
            >
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No appointments found</p>
            </motion.div>
          ) : (
            appointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-gray-900">{appointment.patient_name || "N/A"}</p>
                      <span className="text-gray-400">→</span>
                      <p className="font-semibold text-gray-900">{appointment.doctor_name || "N/A"}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {appointment.appointment_date} | {appointment.start_time} - {appointment.end_time}
                    </p>
                  </div>

                  <motion.span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : appointment.status === "no_show"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {appointment.status}
                  </motion.span>
                </div>

                {/* Action Button for Cancel */}
                {appointment.status !== "completed" && appointment.status !== "cancelled" && appointment.status !== "no_show" && (
                  <button
                    onClick={() => handleCancel(appointment.id)}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel Appointment
                  </button>
                )}
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </PatientLayout>
  );
}
