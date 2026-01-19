// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import AdminLayout from "../../layouts/AdminLayout";
// import { adminApi } from "../../api/admin";

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.05,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       duration: 0.3,
//     },
//   },
// };

// const statusColors = {
//   booked: "bg-blue-100 text-blue-800",
//   completed: "bg-green-100 text-green-800",
//   cancelled: "bg-red-100 text-red-800",
//   no_show: "bg-orange-100 text-orange-800",
// };

// export default function Appointments() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     adminApi
//       .appointments()
//       .then((r) => setData(r.data))
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <AdminLayout>
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//         className="w-full"
//       >
//         <motion.div variants={itemVariants} className="mb-6">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
//             All Appointments
//           </h1>
//           <p className="text-gray-500">View and manage all appointment records</p>
//         </motion.div>

//         {loading ? (
//           <div className="space-y-3">
//             {[1, 2, 3, 4].map((i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse"
//               >
//                 <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {data.map((a, index) => (
//               <motion.div
//                 key={a.id}
//                 variants={itemVariants}
//                 initial="hidden"
//                 animate="visible"
//                 custom={index}
//                 whileHover={{ y: -2 }}
//                 className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
//               >
//                 <div className="flex justify-between items-start">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-2">
//                       <p className="font-semibold text-gray-900">{a.patient_name || "N/A"}</p>
//                       <span className="text-gray-400">→</span>
//                       <p className="font-semibold text-gray-900">{a.doctor_name || "N/A"}</p>
//                     </div>
//                     <p className="text-sm text-gray-500">
//                       {a.appointment_date || "N/A"} | {a.start_time || "N/A"}
//                       {a.end_time && ` - ${a.end_time}`}
//                     </p>
//                   </div>
//                   <motion.span
//                     className={`px-3 py-1 rounded-full text-xs font-medium ${
//                       statusColors[a.status] || "bg-gray-100 text-gray-800"
//                     }`}
//                   >
//                     {a.status || "unknown"}
//                   </motion.span>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </motion.div>
//     </AdminLayout>
//   );
// }




import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "../../layouts/AdminLayout";
import { adminApi } from "../../api/admin";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

const statusColors = {
  booked: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-orange-100 text-orange-800",
};

function formatDateTimeParts(a) {
  // Case 1: backend gives start_datetime/end_datetime
  if (a.start_datetime) {
    const start = new Date(a.start_datetime);
    const end = a.end_datetime ? new Date(a.end_datetime) : null;

    const dateStr = start.toISOString().slice(0, 10); // YYYY-MM-DD
    const startStr = start.toTimeString().slice(0, 5); // HH:MM
    const endStr = end ? end.toTimeString().slice(0, 5) : null;

    return { appointment_date: dateStr, start_time: startStr, end_time: endStr };
  }

  // Case 2: backend gives appointment_date + start_time/end_time
  return {
    appointment_date: a.appointment_date ?? a.date ?? null,
    start_time: a.start_time ?? a.start ?? null,
    end_time: a.end_time ?? a.end ?? null,
  };
}

function getName(userLike) {
  if (!userLike) return null;
  return (
    userLike.full_name ??
    userLike.name ??
    userLike.username ??
    userLike.email ??
    null
  );
}

export default function Appointments() {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminApi
      .appointments()
      .then((r) => {
        console.log("Appointments API raw:", r.data); // <-- keep this once to confirm response shape
        setRaw(Array.isArray(r.data) ? r.data : []);
      })
      .catch((e) => {
        console.error("Failed to load appointments:", e);
        setRaw([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Normalize backend response -> frontend-friendly fields
  const data = useMemo(() => {
    return raw.map((a) => {
      const dt = formatDateTimeParts(a);

      const patientName =
        a.patient_name ??
        a.patientFullName ??
        getName(a.patient) ??
        getName(a.patient_user) ??
        null;

      const doctorName =
        a.doctor_name ??
        a.doctorFullName ??
        getName(a.doctor) ??
        getName(a.doctor_user) ??
        null;

      return {
        id: a.id ?? a.appointment_id ?? `${patientName}-${doctorName}-${dt.start_time}`,
        patient_name: patientName,
        doctor_name: doctorName,
        appointment_date: dt.appointment_date,
        start_time: dt.start_time,
        end_time: dt.end_time,
        status: a.status ?? a.appointment_status ?? "unknown",
      };
    });
  }, [raw]);

  return (
    <AdminLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            All Appointments
          </h1>
          <p className="text-gray-500">View and manage all appointment records</p>
        </motion.div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-gray-600">
            No appointments found.
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((a, index) => (
              <motion.div
                key={a.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-gray-900">{a.patient_name || "N/A"}</p>
                      <span className="text-gray-400">→</span>
                      <p className="font-semibold text-gray-900">{a.doctor_name || "N/A"}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {a.appointment_date || "N/A"} | {a.start_time || "N/A"}
                      {a.end_time ? ` - ${a.end_time}` : ""}
                    </p>
                  </div>

                  <motion.span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[a.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {a.status || "unknown"}
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
