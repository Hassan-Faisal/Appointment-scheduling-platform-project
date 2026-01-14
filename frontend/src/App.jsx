import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
// Auth
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Patient Pages
import PatientDashboard from "./pages/patient/Dashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import MyAppointments from "./pages/patient/MyAppointments";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/Dashboard";
// import Today from "./pages/doctor/Today";
// import History from "./pages/doctor/History";

// Admin Pages
// import AdminDashboard from "./pages/admin/Dashboard";
// import Doctors from "./pages/admin/Doctors";
// import CreateDoctor from "./pages/admin/CreateDoctor";
// import Appointments from "./pages/admin/Appointments";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Patient */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/book" element={<BookAppointment />} />
        <Route path="/patient/appointments" element={<MyAppointments />} />

        {/* Doctor */}
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        {/* <Route path="/doctor/today" element={<Today />} /> */}
        {/* <Route path="/doctor/history" element={<History />} /> */}

        {/* Admin */}
        {/* <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/doctors" element={<Doctors />} />
        <Route path="/admin/create-doctor" element={<CreateDoctor />} /> */}
        {/* <Route path="/admin/appointments" element={<Appointments />} /> */}
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
