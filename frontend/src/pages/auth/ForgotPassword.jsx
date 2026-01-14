import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bgSoft">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">
          Reset Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 border rounded-lg mb-4"
        />

        <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700">
          Send Reset Link
        </button>

        <p className="text-center mt-4 text-sm">
          <Link to="/" className="text-primary">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
