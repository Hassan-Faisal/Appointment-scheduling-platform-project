import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bgSoft">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">
          Clinic Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg mb-4"
        />

        <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700">
          Login
        </button>

        <div className="flex justify-between mt-4 text-sm">
          <Link to="/forgot-password" className="text-primary">
            Forgot password?
          </Link>
          <Link to="/signup" className="text-primary">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
