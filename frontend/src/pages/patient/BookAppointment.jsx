import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Stethoscope, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import PatientLayout from "../../layouts/PatientLayout";
import SlotButton from "../../components/SlotButton";
import { getDoctors, getDoctorSlots, bookAppointment } from "../../api/booking";

const containerVariants = {
  hidden: { opacity: 50 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { y: 16, opacity: 50 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.35 },
  },
};

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [loadingDoctorId, setLoadingDoctorId] = useState(null);
  const [bookingKey, setBookingKey] = useState(null); // `${doctorId}_${start}_${end}`
  const [isOnline, setIsOnline] = useState(false); // ✅ NEW

  // ✅ NEW: explicit doctors loading state (fixes “only date picker shows” confusion)
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Helpful min date (today) to prevent past selection
  const minDate = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // 🔹 Load doctors on page load
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);

        const res = await getDoctors();

        // ✅ safer parsing (fixes nested response shapes)
        const list =
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.data)
            ? res.data.data
            : [];

        setDoctors(list);
      } catch (err) {
        console.error("Failed to load doctors", err);
        toast.error("Failed to load doctors");
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // 🔹 Auto-load slots when date changes (for each doctor)
  useEffect(() => {
    if (!selectedDate) return;
    if (!doctors?.length) return;

    doctors.forEach((doc) => {
      loadSlots(doc.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, doctors]);

  // 🔹 Load slots for ONE doctor
  const loadSlots = async (doctorId) => {
    if (!selectedDate) return;

    try {
      setLoadingDoctorId(doctorId);

      const res = await getDoctorSlots(doctorId, selectedDate);
      const slotList =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

      setSlots((prev) => ({
        ...prev,
        [doctorId]: slotList,
      }));
    } catch (err) {
      console.error("Failed to load slots", err);
      setSlots((prev) => ({
        ...prev,
        [doctorId]: [],
      }));
    } finally {
      setLoadingDoctorId(null);
    }
  };

  // 🔹 Book slot
  const bookSlot = async (doctorId, slot) => {
    if (!slot?.available) return;
    if (!selectedDate) {
      toast.error("Please select a date first");
      return;
    }

    const key = `${doctorId}_${slot.start_time}_${slot.end_time}`;
    setBookingKey(key);

    try {
      // await bookAppointment({
      //   doctor_id: doctorId,
      //   appointment_date: selectedDate,
      //   start_time: slot.start_time,
      //   end_time: slot.end_time,
      // });
      await bookAppointment({
        doctor_id: doctorId,
        appointment_date: selectedDate,
        start_time: slot.start_time,
        end_time: slot.end_time,
        appointment_type: isOnline ? "online" : "physical", // ✅ NEW
      });
      

      toast.success("Appointment booked successfully!", { icon: "✅" });

      // Refresh slots after booking so the button becomes grey/unavailable
      await loadSlots(doctorId);
    } catch (err) {
      console.error("Booking failed", err);
      toast.error("Slot already booked or error occurred", { icon: "❌" });
    } finally {
      setBookingKey(null);
    }
  };

  return (
    <PatientLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full"
      >
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Book Appointment
            </h1>
            <p className="text-gray-500 mt-1">
              Pick a date, then choose an available slot for your preferred doctor.
            </p>
          </motion.div>

          {/* Date Picker Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Select Appointment Date</p>
                <p className="text-base font-semibold text-gray-800">
                  Choose a day to load all doctors’ slots
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                type="date"
                min={minDate}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-72 px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer text-gray-800"
              />

              {!selectedDate && (
                <span className="text-sm text-gray-500">
                  Please select a date to see available slots.
                </span>
              )}
            </div>
          </motion.div>
{/* Online / Physical Toggle */}
<div className="mt-4 flex items-center gap-3">
  <input
    id="online_meeting"
    type="checkbox"
    checked={isOnline}
    onChange={(e) => setIsOnline(e.target.checked)}
    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
  />
  <label
    htmlFor="online_meeting"
    className="text-sm text-gray-700 cursor-pointer"
  >
    Online consultation
  </label>

  {isOnline && (
    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md">
      Meet link will be emailed before appointment
    </span>
  )}
</div>

          {/* ✅ Doctors Section (with price included) */}
          {loadingDoctors ? (
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 text-gray-500"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading doctors...
            </motion.div>
          ) : doctors.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-10 text-center"
            >
              <p className="text-gray-500 text-lg">No doctors available</p>
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {doctors.map((doctor) => {
                const docSlots = slots[doctor.id] || [];
                const isLoadingThis = loadingDoctorId === doctor.id;

                return (
                  <motion.div
                    key={doctor.id}
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow"
                  >
                    {/* Doctor Header */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                        <Stethoscope className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {doctor.full_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {doctor.specialization || "General"}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Price: {doctor.consultation_fee || "N/A"}
                        </p>
                      </div>

                      {/* Quick refresh */}
                      {selectedDate && (
                        <button
                          onClick={() => loadSlots(doctor.id)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                          type="button"
                        >
                          Refresh
                        </button>
                      )}
                    </div>

                    {/* Slot Section */}
                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-700">
                          Slots
                        </p>

                        {selectedDate && (
                          <div className="flex items-center gap-3 text-xs">
                            <span className="inline-flex items-center gap-1">
                              <span className="w-3 h-3 rounded bg-green-600 inline-block" />
                              <span className="text-gray-500">Available</span>
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <span className="w-3 h-3 rounded bg-gray-400 inline-block" />
                              <span className="text-gray-500">Booked</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {!selectedDate ? (
                        <div className="text-sm text-gray-400">
                          Select a date to load slots.
                        </div>
                      ) : isLoadingThis ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading slots...
                        </div>
                      ) : docSlots.length === 0 ? (
                        <div className="text-sm text-gray-400">
                          No slots available for this date.
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {docSlots.map((slot, index) => {
                            const key = `${doctor.id}_${slot.start_time}_${slot.end_time}`;
                            const isBookingThis = bookingKey === key;

                            return (
                              <SlotButton
                                key={index}
                                time={`${slot.start_time} - ${slot.end_time}`}
                                available={slot.available}
                                loading={isBookingThis}
                                onClick={() => bookSlot(doctor.id, slot)}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </motion.div>
    </PatientLayout>
  );
}
