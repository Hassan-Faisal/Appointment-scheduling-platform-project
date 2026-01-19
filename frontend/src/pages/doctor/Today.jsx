// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
// import toast from "react-hot-toast";
// import DoctorLayout from "../../layouts/DoctorLayout";
// import { doctorApi } from "../../api/doctor";

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       duration: 0.4,
//     },
//   },
// };

// export default function Today() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const load = () => {
//     setLoading(true);
//     doctorApi
//       .today()
//       .then((res) =>{
//         console.log(res.data),
//         setData(res.data)
//         })
//       .catch((err) => {
//         console.error("Error loading appointments:", err);
//         toast.error("Failed to load appointments");
//       })
//       .finally(() => setLoading(false));
//   };

//   useEffect(load, []);

//   const handleAction = async (action, id, label) => {
//     try {
//       await action(id);
//       toast.success(`${label} successfully!`, { icon: "✅" });
//       load();
//     } catch (error) {
//       toast.error(`Failed to ${label.toLowerCase()}`, { icon: "❌" });
//     }
//   };

//   return (
//     <DoctorLayout>
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//         className="w-full"
//       >
//         {/* Header */}
//         <motion.div variants={itemVariants} className="mb-8">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
//             Today's Appointments
//           </h1>
//           <p className="text-gray-500">Manage your appointments for today</p>
//         </motion.div>

//         {/* Appointments List */}
//         {loading ? (
//           <div className="space-y-4">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
//                 <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//               </div>
//             ))}
//           </div>
//         ) : data.length === 0 ? (
//           <motion.div
//             variants={itemVariants}
//             className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center"
//           >
//             <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500 text-lg">No appointments scheduled for today</p>
//           </motion.div>
//         ) : (
//           <div className="space-y-4">
//             {data.map((a, index) => (
//               <motion.div
//                 key={a.id}
//                 variants={itemVariants}
//                 custom={index}
//                 className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
//               >
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                   {/* Patient Info */}
//                   <div className="flex items-start gap-4 flex-1">
//                     <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-md">
//                       <User className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-bold text-gray-800 mb-1">{a.patient_name}</h3>
//                       <div className="flex items-center gap-4 text-sm text-gray-600">
//                         <span className="flex items-center gap-1">
//                           <Clock className="w-4 h-4" />
//                           {a.start_time} - {a.end_time}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-wrap gap-2">
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => handleAction(() => doctorApi.complete(a.id), a.id, "Completed")}
//                       className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
//                     >
//                       <CheckCircle className="w-4 h-4" />
//                       Complete
//                     </motion.button>

//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => handleAction(() => doctorApi.noShow(a.id, "patient"), a.id, "Marked as missed (patient)")}
//                       className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
//                     >
//                       <AlertCircle className="w-4 h-4" />
//                       Missed (Patient)
//                     </motion.button>

//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => handleAction(() => doctorApi.noShow(a.id, "doctor"), a.id, "Marked as missed (doctor)")}
//                       className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
//                     >
//                       <AlertCircle className="w-4 h-4" />
//                       Missed (Doctor)
//                     </motion.button>

//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => {
//                         if (window.confirm("Are you sure you want to cancel this appointment?")) {
//                           handleAction(() => doctorApi.cancel(a.id), a.id, "Cancelled");
//                         }
//                       }}
//                       className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
//                     >
//                       <X className="w-4 h-4" />
//                       Cancel
//                     </motion.button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </motion.div>
//     </DoctorLayout>
//   );
// }

///////////////

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
// import toast from "react-hot-toast";
// import DoctorLayout from "../../layouts/DoctorLayout";
// import { doctorApi } from "../../api/doctor";

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       duration: 0.4,
//     },
//   },
// };

// export default function Today() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const load = () => {
//     setLoading(true);
//     doctorApi
//       .today()
//       .then((res) => {
//         console.log("Fetched data for today's appointments:", res.data); // Log the response
//         if (Array.isArray(res.data)) {
//           setData(res.data);  // Set the data if it's an array
//         } else {
//           console.error("Invalid data format:", res.data);
//           toast.error("Invalid data format for today's appointments");
//         }
//       })
//       .catch((err) => {
//         console.error("Error loading appointments:", err);
//         toast.error("Failed to load appointments");
//       })
//       .finally(() => setLoading(false));
//   };

//   useEffect(load, []);

//   const handleAction = async (action, id, label) => {
//     try {
//       await action(id);
//       toast.success(`${label} successfully!`, { icon: "✅" });
//       load();
//     } catch (error) {
//       toast.error(`Failed to ${label.toLowerCase()}`, { icon: "❌" });
//     }
//   };

//   return (
//     <DoctorLayout>
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//         className="w-full"
//       >
//         {/* Header */}
//         <motion.div variants={itemVariants} className="mb-8">
//           <h1 className="text-3xl font-semibold text-gray-800">Today's Appointments</h1>
//           <p className="text-gray-500">Manage your appointments for today</p>
//         </motion.div>

//         {/* Appointments List */}
//         {loading ? (
//           <div className="space-y-4">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
//                 <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//               </div>
//             ))}
//           </div>
//         ) : data.length === 0 ? (
//           <motion.div
//             variants={itemVariants}
//             className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center"
//           >
//             <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500 text-lg">No appointments scheduled for today</p>
//           </motion.div>
//         ) : (
//           <div className="space-y-4">
//             {data.map((a, index) => (
//               <motion.div
//                 key={a.id}
//                 variants={itemVariants}
//                 custom={index}
//                 className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
//               >
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                   {/* Patient Info */}
//                   <div className="flex items-start gap-4 flex-1">
//                     <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-md">
//                       <User className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-bold text-gray-800 mb-1">{a.patient_name || "No Name"}</h3>
//                       <div className="flex items-center gap-4 text-sm text-gray-600">
//                         <span className="flex items-center gap-1">
//                           <Clock className="w-4 h-4" />
//                           {a.start_time} - {a.end_time}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-wrap gap-2">
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => handleAction(() => doctorApi.complete(a.id), a.id, "Completed")}
//                       className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
//                     >
//                       <CheckCircle className="w-4 h-4" />
//                       Complete
//                     </motion.button>

//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => handleAction(() => doctorApi.noShow(a.id, "patient"), a.id, "Marked as missed (patient)")}
//                       className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
//                     >
//                       <AlertCircle className="w-4 h-4" />
//                       Missed (Patient)
//                     </motion.button>

//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => handleAction(() => doctorApi.noShow(a.id, "doctor"), a.id, "Marked as missed (doctor)")}
//                       className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
//                     >
//                       <AlertCircle className="w-4 h-4" />
//                       Missed (Doctor)
//                     </motion.button>

//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => {
//                         if (window.confirm("Are you sure you want to cancel this appointment?")) {
//                           handleAction(() => doctorApi.cancel(a.id), a.id, "Cancelled");
//                         }
//                       }}
//                       className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
//                     >
//                       <X className="w-4 h-4" />
//                       Cancel
//                     </motion.button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </motion.div>
//     </DoctorLayout>
//   );
// }

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, CheckCircle, AlertCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import DoctorLayout from "../../layouts/DoctorLayout";
import { doctorApi } from "../../api/doctor";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export default function Today() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    doctorApi
      .today()
      .then((res) => {
        console.log("Fetched data for today's appointments:", res.data); // Log the response for debugging
        if (Array.isArray(res.data)) {
          setData(res.data); // Set the data if it's an array
        } else {
          console.error("Invalid data format:", res.data);
          toast.error("Invalid data format for today's appointments");
        }
      })
      .catch((err) => {
        console.error("Error loading appointments:", err);
        toast.error("Failed to load appointments");
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleAction = async (action, id, label) => {
    try {
      await action(id);
      toast.success(`${label} successfully!`, { icon: "✅" });
      load();
    } catch (error) {
      toast.error(`Failed to ${label.toLowerCase()}`, { icon: "❌" });
    }
  };

  return (
    <DoctorLayout>
      <motion.div
        initial="visible"
        animate="visible"
        variants={containerVariants}
        className="w-full"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Today's Appointments</h1>
          <p className="text-gray-500">Manage your appointments for today</p>
        </motion.div>

        {/* Appointments List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center"
          >
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No appointments scheduled for today</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {data.map((a, index) => (
              <motion.div
                key={a.id}
                variants={itemVariants}
                custom={index}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Patient Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-md">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{a.patient_name || "No Name"}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {a.start_time} - {a.end_time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAction(() => doctorApi.complete(a.id), a.id, "Completed")}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAction(() => doctorApi.noShow(a.id, "patient"), a.id, "Marked as missed (patient)")}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Missed (Patient)
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAction(() => doctorApi.noShow(a.id, "doctor"), a.id, "Marked as missed (doctor)")}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Missed (Doctor)
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (window.confirm("Are you sure you want to cancel this appointment?")) {
                          handleAction(() => doctorApi.cancel(a.id), a.id, "Cancelled");
                        }
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </DoctorLayout>
  );
}
