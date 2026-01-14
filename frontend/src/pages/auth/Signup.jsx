import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bgSoft">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">
          Patient Signup
        </h2>

        {/* <input className="w-full p-3 border rounded-lg mb-3" placeholder="Full Name" /> */}
        <input className="w-full p-3 border rounded-lg mb-3" placeholder="Email" />
        <input className="w-full p-3 border rounded-lg mb-3" placeholder="Password" type="password" />
        <input className="w-full p-3 border rounded-lg mb-4" placeholder="Confirm Password" type="password" />

        <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700">
          Create Account
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
