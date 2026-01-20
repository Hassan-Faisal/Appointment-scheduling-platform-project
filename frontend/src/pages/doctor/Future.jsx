import { useEffect, useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { doctorApi } from "../../api/doctor";

export default function Future() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorApi
      .upcoming()
      .then((res) => {
        console.log("Upcoming appointments response: ", res.data); // Log response to inspect the data
        if (Array.isArray(res.data)) {
          setData(res.data); // Set the data if it's an array
        } else {
          console.error("Data format is incorrect: ", res.data);
        }
      })
      .catch((err) => {
        console.error("Error loading appointments:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DoctorLayout>
      <div className="w-full p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Upcoming Appointments</h1>
          <p className="text-gray-500">View your future scheduled appointments</p>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : data.length === 0 ? (
          <div className="text-center text-gray-500">No upcoming appointments</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4"
              >
                {/* Appointment Details */}
                <h3 className="text-xl font-semibold text-gray-800">
                  {a.patient_name || "No Name"}
                </h3>
                <p className="text-sm text-gray-600">Doctor: {a.doctor_name || "No Doctor"}</p>
                <p className="text-sm text-gray-600">
                  Appointment Date:{" "}
                  {new Date(a.appointment_date).toLocaleDateString("en-US")}
                </p>
                <p className="text-sm text-gray-600">
                  {a.start_time} - {a.end_time}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
