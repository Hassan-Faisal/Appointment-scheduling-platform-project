import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import DoctorLayout from "../../layouts/DoctorLayout";
import { doctorApi } from "../../api/doctor";

// Status Configurations
const statusConfig = {
  completed: {
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    textColor: "text-green-800",
    icon: CheckCircle,
    label: "Completed",
  },
  cancelled: {
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    textColor: "text-red-800",
    icon: XCircle,
    label: "Cancelled",
  },
  no_show: {
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-800",
    icon: AlertCircle,
    label: "No Show",
  },
};

export default function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorApi
      .history()
      .then((res) => {
        console.log("Fetched data for history:", res.data); // Log response for debugging
        setData(res.data);
      })
      .catch((err) => {
        console.error("Error loading history:", err);
        toast.error("Failed to load appointments history");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DoctorLayout>
      <motion.div
        className="w-full"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Appointment History</h1>
          <p className="text-gray-500">View your past appointments</p>
        </div>

        {/* History List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/5"></div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No appointment history</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((a, index) => {
              const status = statusConfig[a.status] || statusConfig.completed;
              const StatusIcon = status.icon;

              return (
                <div
                  key={a.id}
                  className={`${status.bgColor} rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Patient Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 bg-gradient-to-br ${status.color} rounded-full flex items-center justify-center shadow-md`}>
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{a.patient_name}</h3>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(a.appointment_date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {a.start_time} - {a.end_time}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${status.color} text-white rounded-xl shadow-md`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="font-semibold text-sm">{status.label}</span>
                      </div>
                      {a.no_show_by && (
                        <span className="text-sm text-gray-600">
                          (by {a.no_show_by})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </DoctorLayout>
  );
}
