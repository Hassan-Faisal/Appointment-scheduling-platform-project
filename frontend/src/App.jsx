import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'

//View
import HomePage from "./pages/View/Home";
// Auth
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResetPassword from "./pages/auth/ResetPassword";
// Patient Pages
import PatientDashboard from "./pages/patient/Dashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import MyAppointments from "./pages/patient/MyAppointments";
import Profile from "./pages/patient/Profile";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/Dashboard";
import Today from "./pages/doctor/Today";
import History from "./pages/doctor/History";
import Future from "./pages/doctor/Future";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import Doctors from "./pages/admin/Doctors";
import Appointments from "./pages/admin/Appointments";
import Schedule from "./pages/admin/Schedule";
import Patients from "./pages/admin/Patients";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* View */}
        <Route path="/" element={<HomePage />} />
        
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Patient */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/book" element={<BookAppointment />} />
        <Route path="/patient/appointments" element={<MyAppointments />} />
        <Route path="/patient/profile" element={<Profile/>}/>

        {/* Doctor */}
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/today" element={<Today />} /> 
        <Route path="/doctor/history" element={<History />} />
        <Route path="/doctor/future" element={<Future />} />

        {/* Admin */}
         <Route path="/admin/dashboard" element={<AdminDashboard />} />
         <Route path="/admin/doctors" element={<Doctors />} />
        <Route path="/admin/patients" element={<Patients />} />
        <Route path="/admin/appointments" element={<Appointments />} /> 
        <Route path="/admin/schedule" element={<Schedule />} />
      </Routes>
    </Router>
  );
}

// function App() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-900">
//       <h1 className="text-5xl font-bold text-pink-500">
//         Tailwind is Working 🎉
//       </h1>
//     </div>
//   );
// }

// export default App;
