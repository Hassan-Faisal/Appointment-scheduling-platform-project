// import { useEffect, useState } from "react";
// import PatientLayout from "../../layouts/PatientLayout";
// import SlotButton from "../../components/SlotButton";
// import {
//   getDoctors,
//   getDoctorSlots,
//   bookAppointment,
// } from "../../api/booking";

// export default function BookAppointment() {
//   const [doctors, setDoctors] = useState([]);
//   const [slots, setSlots] = useState({});
//   const [selectedDate, setSelectedDate] = useState("");

//   useEffect(() => {
//     getDoctors().then((res) => setDoctors(res.data));
//   }, []);

//   const loadSlots = async (doctorId) => {
//     if (!selectedDate) return;
//     const res = await getDoctorSlots(doctorId, selectedDate);
//     setSlots((prev) => ({ ...prev, [doctorId]: res.data }));
//   };

//   const bookSlot = async (doctorId, slot) => {
//     await bookAppointment({
//       doctor_id: doctorId,
//       appointment_date: selectedDate,
//       start_time: slot.start_time,
//       end_time: slot.end_time,
//     });
//     alert("Appointment booked!");
//   };

//   return (
//     <PatientLayout>
//       <h1 className="text-xl font-bold mb-4">Book Appointment</h1>

//       <input
//         type="date"
//         className="border p-2 mb-6"
//         value={selectedDate}
//         onChange={(e) => setSelectedDate(e.target.value)}
//       />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {doctors.map((doc) => (
//           <div key={doc.id} className="bg-white p-4 rounded-xl shadow">
//             <h2 className="font-bold">{doc.full_name}</h2>
//             <p className="text-gray-500">{doc.specialization}</p>

//             <button
//               onClick={() => loadSlots(doc.id)}
//               className="text-sm text-blue-600 mt-2"
//             >
//               Load Slots
//             </button>

//             <div className="mt-4 flex flex-wrap gap-2">
//               {(slots[doc.id] || []).map((slot) => (
//                 <SlotButton
//                   key={slot.start_time}
//                   time={slot.start_time}
//                   available={slot.available}
//                   onClick={() => bookSlot(doc.id, slot)}
//                 />
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </PatientLayout>
//   );
// }


// import { useEffect, useState } from "react";
// import PatientLayout from "../../layouts/PatientLayout";
// import SlotButton from "../../components/SlotButton";
// import {
//   getDoctors,
//   getDoctorSlots,
//   bookAppointment,
// } from "../../api/booking";

// export default function BookAppointment() {
//   const [doctors, setDoctors] = useState([]);
//   const [slots, setSlots] = useState({});
//   const [selectedDate, setSelectedDate] = useState("");

//   // useEffect(() => {
//   //   getDoctors().then((res) => {
//   //     // ✅ FIX: ensure doctors is ALWAYS an array
//   //     const doctorList = Array.isArray(res.data)
//   //       ? res.data
//   //       : res.data?.data || [];

//   //     setDoctors(doctorList);
//   //   });
//   // }, []);

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const res = await getDoctors();
//         const doctorList = Array.isArray(res.data)
//           ? res.data
//           : res.data?.data || [];
  
//         setDoctors(doctorList);
//       } catch (err) {
//         console.error("Failed to load doctors", err);
//       }
//     };
    
//     console.log("Doctors:", doctors);
//     fetchDoctors();
//   }, []);
  

//   const loadSlots = async (doctorId) => {
//     if (!selectedDate) return;

//     const res = await getDoctorSlots(doctorId, selectedDate);

//     // ✅ also safely handle slot response
//     const slotList = Array.isArray(res.data)
//       ? res.data
//       : res.data?.data || [];

//     setSlots((prev) => ({ ...prev, [doctorId]: slotList }));
//   };



//   const bookSlot = async (doctorId, slot) => {
//     await bookAppointment({
//       doctor_id: doctorId,
//       appointment_date: selectedDate,
//       start_time: slot.start_time,
//       end_time: slot.end_time,
//     });
//     alert("Appointment booked!");
//   };

//   return (
//     <PatientLayout>
//       <h1 className="text-xl font-bold mb-4">Book Appointment</h1>

//       <input
//         type="date"
//         className="border p-2 mb-6"
//         value={selectedDate}
//         onChange={(e) => setSelectedDate(e.target.value)}
//       />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {doctors.map((doc) => (
//           <div key={doc.id} className="bg-white p-4 rounded-xl shadow">
//             <h2 className="font-bold">{doc.full_name}</h2>
//             <p className="text-gray-500">{doc.specialization}</p>

//             <button
//               onClick={() => loadSlots(doc.id)}
//               className="text-sm text-blue-600 mt-2"
//             >
//               Load Slots
//             </button>

//             <div className="mt-4 flex flex-wrap gap-2">
//               {(slots[doc.id] || []).map((slot) => (
//                 <SlotButton
//                   key={slot.start_time}
//                   time={slot.start_time}
//                   available={slot.available}
//                   onClick={() => bookSlot(doc.id, slot)}
//                 />
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </PatientLayout>
//   );
// }



// ///////////
// import { useEffect, useState } from "react";
// import PatientLayout from "../../layouts/PatientLayout";
// import SlotButton from "../../components/SlotButton";
// import {
//   getDoctors,
//   getDoctorSlots,
//   bookAppointment,
// } from "../../api/booking";

// export default function BookAppointment() {
//   const [doctors, setDoctors] = useState([]);
//   const [slots, setSlots] = useState({});
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedDoctorId, setSelectedDoctorId] = useState(null);
//   const [loadingSlots, setLoadingSlots] = useState(false);

//   // 🔹 Load doctors once
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const res = await getDoctors();
//         const doctorList = Array.isArray(res.data)
//           ? res.data
//           : res.data?.data || [];
//         setDoctors(doctorList);
//       } catch (err) {
//         console.error("Failed to load doctors", err);
//       }
//     };

//     fetchDoctors();
//   }, []);

//   // 🔹 Auto-load slots when date OR doctor changes
//   useEffect(() => {
//     if (selectedDoctorId && selectedDate) {
//       loadSlots(selectedDoctorId);
//     }
//   }, [selectedDate, selectedDoctorId]);

//   const loadSlots = async (doctorId) => {
//     if (!selectedDate) return;

//     setSelectedDoctorId(doctorId);
//     setLoadingSlots(true);

//     try {
//       const res = await getDoctorSlots(doctorId, selectedDate);
//       const slotList = Array.isArray(res.data)
//         ? res.data
//         : res.data?.data || [];

//       setSlots((prev) => ({ ...prev, [doctorId]: slotList }));
//     } catch (err) {
//       console.error("Failed to load slots", err);
//     } finally {
//       setLoadingSlots(false);
//     }
//   };

//   const bookSlot = async (doctorId, slot) => {
//     if (!slot.available) return;

//     await bookAppointment({
//       doctor_id: doctorId,
//       appointment_date: selectedDate,
//       start_time: slot.start_time,
//       end_time: slot.end_time,
//     });

//     alert("Appointment booked!");
//     loadSlots(doctorId); // refresh slots
//   };

//   return (
//     <PatientLayout>
//       <h1 className="text-xl font-bold mb-4">Book Appointment</h1>

//       {/* 📅 Date Picker */}
//       <input
//         type="date"
//         className="border p-2 mb-6"
//         value={selectedDate}
//         onChange={(e) => setSelectedDate(e.target.value)}
//       />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {doctors.map((doc) => (
//           <div key={doc.id} className="bg-white p-4 rounded-xl shadow">
//             <h2 className="font-bold">{doc.full_name}</h2>
//             <p className="text-gray-500">{doc.specialization}</p>

//             <button
//               onClick={() => loadSlots(doc.id)}
//               className="text-sm text-blue-600 mt-2"
//             >
//               Load Slots
//             </button>

//             <div className="mt-4 flex flex-wrap gap-2">
//               {/* 🔄 Loading Spinner */}
//               {loadingSlots && selectedDoctorId === doc.id && (
//                 <p className="text-sm text-gray-500">Loading slots...</p>
//               )}

//               {/* 🚫 No slots */}
//               {!loadingSlots &&
//                 selectedDoctorId === doc.id &&
//                 (slots[doc.id] || []).length === 0 && (
//                   <p className="text-sm text-gray-400">No slots available</p>
//                 )}

//               {/* ✅ Slots */}
//               {(slots[doc.id] || []).map((slot) => (
//                 <SlotButton
//                   key={slot.start_time}
//                   time={slot.start_time}
//                   available={slot.available}
//                   disabled={!slot.available}
//                   onClick={() => bookSlot(doc.id, slot)}
//                 />
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </PatientLayout>
//   );
// }



// import { useEffect, useState } from "react";
// import PatientLayout from "../../layouts/PatientLayout";
// import SlotButton from "../../components/SlotButton";
// import {
//   getDoctors,
//   getDoctorSlots,
//   bookAppointment,
// } from "../../api/booking";

// export default function BookAppointment() {
//   const [doctors, setDoctors] = useState([]);
//   const [slots, setSlots] = useState({});
//   const [selectedDate, setSelectedDate] = useState("");
//   const [loadingDoctorId, setLoadingDoctorId] = useState(null);

//   // 🔹 Load doctors on page load
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const res = await getDoctors();
//         const list = Array.isArray(res.data)
//           ? res.data
//           : res.data?.data || [];
//         setDoctors(list);
//       } catch (err) {
//         console.error("Failed to load doctors", err);
//       }
//     };

//     fetchDoctors();
//   }, []);

//   // 🔹 Auto-load slots when date changes
//   useEffect(() => {
//     if (!selectedDate) return;

//     doctors.forEach((doc) => {
//       loadSlots(doc.id);
//     });
//   }, [selectedDate]);

//   const loadSlots = async (doctorId) => {
//     if (!selectedDate) return;
//     const res = await getDoctorSlots(doctorId, selectedDate);
//     console.log("Doctor:", doctorId, "Date:", selectedDate);
//     console.log("Slots API response:", res.data);
    
//     setLoadingDoctorId(doctorId);

//     try {
//       const res = await getDoctorSlots(doctorId, selectedDate);
//       const slotList = Array.isArray(res.data)
//         ? res.data
//         : res.data?.data || [];

//       setSlots((prev) => ({
//         ...prev,
//         [doctorId]: slotList,
//       }));
//     } catch (err) {
//       console.error("Failed to load slots", err);
//     } finally {
//       setLoadingDoctorId(null);
//     }
//   };


  

//   const bookSlot = async (doctorId, slot) => {
//     if (!slot.available) return;

//     try {
//       await bookAppointment({
//         doctor_id: doctorId,
//         appointment_date: selectedDate,
//         start_time: slot.start_time,
//         end_time: slot.end_time,
//       });

//       alert("Appointment booked successfully!");
//       loadSlots(doctorId); // refresh slots
//     } catch (err) {
//       console.error("Booking failed", err);
//       alert("Failed to book appointment");
//     }
//   };

//   return (
//     <PatientLayout>
//       <h1 className="text-xl font-bold mb-6">Book Appointment</h1>

//       {/* 📅 Date Picker */}
//       <input
//         type="date"
//         className="border p-2 mb-6 rounded"
//         value={selectedDate}
//         onChange={(e) => setSelectedDate(e.target.value)}
//       />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {doctors.map((doc) => (
//           <div key={doc.id} className="bg-white p-4 rounded-xl shadow">
//             <h2 className="font-bold text-lg">{doc.full_name}</h2>
//             <p className="text-gray-500">{doc.specialization}</p>

//             <div className="mt-4 flex flex-wrap">
//               {/* 🔄 Loading */}
//               {loadingDoctorId === doc.id && (
//                 <p className="text-sm text-gray-500">Loading slots...</p>
//               )}

//               {/* 🚫 No slots */}
//               {selectedDate &&
//                 loadingDoctorId !== doc.id &&
//                 (slots[doc.id] || []).length === 0 && (
//                   <p className="text-sm text-gray-400">
//                     No slots available
//                   </p>
//                 )}

//               {/* ✅ Slots */}
//               {(slots[doc.id] || []).map((slot) => (
//                 <SlotButton
//                   key={slot.start_time}
//                   time={`${slot.start_time} - ${slot.end_time}`}
//                   available={slot.available}
//                   onClick={() => bookSlot(doc.id, slot)}
//                 />
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </PatientLayout>
//   );
// }


import { useEffect, useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import SlotButton from "../../components/SlotButton";
import {
  getDoctors,
  getDoctorSlots,
  bookAppointment,
} from "../../api/booking";

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [loadingDoctorId, setLoadingDoctorId] = useState(null);

  // 🔹 Load doctors on page load
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getDoctors();
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setDoctors(list);
      } catch (err) {
        console.error("Failed to load doctors", err);
      }
    };

    fetchDoctors();
  }, []);

  // 🔹 Auto-load slots when date changes
  useEffect(() => {
    if (!selectedDate) return;

    doctors.forEach((doc) => {
      loadSlots(doc.id);
    });
  }, [selectedDate, doctors]);

  // 🔹 Load slots for ONE doctor
  const loadSlots = async (doctorId) => {
    if (!selectedDate) return;

    try {
      setLoadingDoctorId(doctorId);

      console.log("Doctor:", doctorId, "Date:", selectedDate);

      const res = await getDoctorSlots(doctorId, selectedDate);
      const slotList = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      console.log("Slots API response:", slotList);

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
    if (!slot.available) return;

    try {
      await bookAppointment({
        doctor_id: doctorId,
        appointment_date: selectedDate,
        start_time: slot.start_time,
        end_time: slot.end_time,
      });

      alert("Appointment booked successfully!");
      loadSlots(doctorId); // refresh slots
    } catch (err) {
      console.error("Booking failed", err);
      alert("Slot already booked or error occurred");
    }
  };

  return (
    <PatientLayout>
      <h1 className="text-xl font-bold mb-6">Book Appointment</h1>

      {/* 📅 Date Picker */}
      <input
        type="date"
        className="border p-2 mb-6 rounded"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-xl shadow p-6"
          >
            <h3 className="text-lg font-semibold">
              {doctor.full_name}
            </h3>
            <p className="text-sm text-gray-500">
              {doctor.specialization}
            </p>

            {/* SLOT SECTION */}
            <div className="mt-4">
              {/* 🔄 Loading */}
              {loadingDoctorId === doctor.id && (
                <p className="text-sm text-gray-500">
                  Loading slots...
                </p>
              )}

              {/* 🚫 No slots */}
              {selectedDate &&
                loadingDoctorId !== doctor.id &&
                (slots[doctor.id] || []).length === 0 && (
                  <p className="text-sm text-gray-400">
                    No slots available
                  </p>
                )}

              {/* ✅ Slots */}
              {loadingDoctorId !== doctor.id &&
                (slots[doctor.id] || []).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {slots[doctor.id].map((slot, index) => (
                      <SlotButton
                        key={index}
                        time={`${slot.start_time} - ${slot.end_time}`}
                        available={slot.available}
                        onClick={() =>
                          bookSlot(doctor.id, slot)
                        }
                      />
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </PatientLayout>
  );
}
