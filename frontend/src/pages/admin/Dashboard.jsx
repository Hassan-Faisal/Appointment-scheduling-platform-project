import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Stethoscope, Calendar, XCircle, Clock } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { adminApi } from "../../api/admin";
import StatCard from "../../components/StatCard";

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

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .dashboard()
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error("Error loading stats:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-500">Track your system statistics</p>
        </motion.div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard
              title="Patients"
              value={stats.patients}
              index={0}
              icon={Users}
            />
            <StatCard
              title="Doctors"
              value={stats.doctors}
              index={1}
              icon={Stethoscope}
            />
            <StatCard
              title="Appointments"
              value={stats.appointments}
              index={2}
              icon={Calendar}
            />
            <StatCard
              title="Cancelled"
              value={stats.cancelled}
              index={3}
              icon={XCircle}
            />
            <StatCard
              title="Missed"
              value={stats.missed}
              index={4}
              icon={Clock}
            />
          </div>
        ) : null}
      </motion.div>
    </AdminLayout>
  );
}
