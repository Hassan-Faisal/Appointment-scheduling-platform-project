

// import { useParams } from "react-router-dom"; // Import useParams from react-router-dom
// import { useState } from "react";
// import { resetPassword } from "../../api/auth";

// export default function ResetPassword() {
//   const { token } = useParams();  // Get the token from URL
//   const [newPassword, setNewPassword] = useState("");
//   const [loading, setLoading] = useState(false);


// const handleResetPassword = async () => {
//     setLoading(true);
//     try {
//       const response = await resetPassword(token, newPassword);  // Send token and new password
//       alert("Password successfully reset!");
//     } catch (error) {
//       console.error("Error resetting password:", error);
//       const errorMessage = error?.response?.data?.detail || error?.message || "An unknown error occurred.";
      
//       // Handle specific case for expired token
//       if (errorMessage === "Token has expired") {
//         alert("Your reset token has expired. Please request a new one.");
//       } else {
//         alert("Error resetting password: " + errorMessage);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  
  
//   return (
//     <div>
//       <input
//         type="password"
//         placeholder="Enter new password"
//         onChange={(e) => setNewPassword(e.target.value)}
//         value={newPassword}
//       />
//       <button onClick={handleResetPassword} disabled={loading}>
//         {loading ? "Resetting..." : "Reset Password"}
//       </button>
//     </div>
//   );
// };


import { useParams, Link } from "react-router-dom"; // Import useParams from react-router-dom
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { resetPassword } from "../../api/auth";

const containerVariants = {
  hidden: { opacity: 40 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 40 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export default function ResetPassword() {
  const { token } = useParams(); // Get the token from URL
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const response = await resetPassword(token, newPassword); // Send token and new password to the backend
      setSent(true);
      toast.success("Password successfully reset!", {
        icon: "✅",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      const errorMessage = error?.response?.data?.detail || error?.message || "An unknown error occurred.";
      toast.error("Error resetting password: " + errorMessage, {
        icon: "❌",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-md"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 p-8 md:p-10"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-300 to-blue-600 rounded-2xl shadow-lg mb-4"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Reset Password
            </h2>
            <p className="text-gray-500">
              {sent
                ? "Your password has been successfully reset."
                : "Enter a new password to reset your account."}
            </p>
          </motion.div>

          {!sent ? (
            <div>
              <input
                type="password"
                placeholder="Enter new password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                className="w-full pl-4 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white mb-6"
              />
              <motion.button
                onClick={handleResetPassword}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full bg-gradient-to-r from-blue-300 to-blue-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all duration-200 ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-xl hover:shadow-primary/40"
                }`}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Resetting...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                  </>
                )}
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4"
              >
                <CheckCircle className="w-10 h-10 text-green-600" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Password Reset Successful!
              </h3>
              <p className="text-gray-600 mb-6">You can now log in with your new password.</p>
              <p className="text-sm text-gray-500">Go back to the login page to continue.</p>
            </motion.div>
          )}

           {/* Back to Login Link */}
           <motion.div
            variants={itemVariants}
            className="mt-6 text-center"
          >
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link> 
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
