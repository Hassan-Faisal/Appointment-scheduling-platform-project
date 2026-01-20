import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Bell, User as UserIcon, Settings, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Get user name from localStorage or API
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        // You can fetch user name from API here
        setUserName("User"); // Placeholder - replace with actual user name
      } catch (e) {
        console.error("Error parsing token:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    // Patient routes
    if (path.includes("patient/dashboard")) return "Dashboard";
    if (path.includes("patient/book")) return "Book Appointment";
    if (path.includes("patient/appointments")) return "My Appointments";
    if (path.includes("patient/profile")) return "Profile";
    // Doctor routes
    if (path === "/doctor" || path.includes("doctor/dashboard")) return "Dashboard";
    if (path.includes("doctor/today")) return "Today's Appointments";
    if (path.includes("doctor/future")) return "Upcoming Appointments";
    if (path.includes("doctor/history")) return "Appointment History";
    return "Dashboard";
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/95"
    >
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Page Title */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {getPageTitle()}
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
        </motion.div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => toast("No new notifications", { icon: "🔔" })}
            className="relative p-2.5 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5" />
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"
            />
          </motion.button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all duration-200 shadow-sm"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-9 h-9 bg-gradient-to-br from-blue-300 to-blue-600 rounded-full flex items-center justify-center shadow-md"
              >
                <UserIcon className="w-5 h-5 text-white" />
              </motion.div>
              <span className="font-medium text-gray-700">{userName || "User"}</span>
              <motion.div
                animate={{ rotate: showDropdown ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </motion.div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showDropdown && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20 overflow-hidden"
                  >
                    {/* <motion.button
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        navigate("/patient/profile");
                        setShowDropdown(false);
                        toast.success("Navigating to profile");
                      }}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 flex items-center gap-3 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-primary" />
                      View Profile
                    </motion.button> 
                    <motion.button
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        setShowDropdown(false);
                        toast("Settings coming soon", { icon: "⚙️" });
                      }}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 flex items-center gap-3 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      Settings
                    </motion.button> */}
                    <div className="border-t border-gray-200 my-1"></div>
                    <motion.button
                      whileHover={{ x: 4 }}
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 flex items-center gap-3 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </motion.button>
                  </motion.div>
                  {/* Click outside to close dropdown */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
