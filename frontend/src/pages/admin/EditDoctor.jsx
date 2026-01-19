// export default function EditDoctor({ open, doctor, onClose, onSave }) {
//     if (!open || !doctor) return null;
  
//     return (
//       <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//         <div className="bg-white p-6 rounded-xl w-[420px]">
//           <h2 className="text-lg font-bold mb-4">Update Doctor</h2>
  
//           {[
//             ["full_name", "Full Name"],
//             ["specialization", "Specialization"],
//             ["experience_years", "Experience Years"],
//             ["consultation_fee", "Consultation Fee"],
//           ].map(([key, label]) => (
//             <input
//               key={key}
//               defaultValue={doctor[key]}
//               placeholder={label}
//               className="border p-2 w-full mb-3"
//               onChange={(e) =>
//                 onSave((prev) => ({ ...prev, [key]: e.target.value }))
//               }
//             />
//           ))}
  
//           <div className="flex justify-end gap-2 mt-4">
//             <button onClick={onClose} className="px-4 py-2 border rounded">
//               Cancel
//             </button>
//             <button
//               onClick={() => onSave("submit")}
//               className="px-4 py-2 bg-green-600 text-white rounded"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

////////

// import React, { useState } from "react";  // <-- Make sure this is added

// export default function EditDoctor({ open, doctor, onClose, onSave }) {
//   if (!open || !doctor) return null;

//   // Set form data based on selected doctor when modal opens
//   const [form, setForm] = useState({
//       full_name: doctor.full_name,
//       specialization: doctor.specialization,
//       experience_years: doctor.experience_years,
//       consultation_fee: doctor.consultation_fee,
//   });

//   const handleChange = (key, value) => {
//       setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   return (
//       <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl w-[420px]">
//               <h2 className="text-lg font-bold mb-4">Update Doctor</h2>

//               {[
//                   ["full_name", "Full Name"],
//                   ["specialization", "Specialization"],
//                   ["experience_years", "Experience Years"],
//                   ["consultation_fee", "Consultation Fee"],
//               ].map(([key, label]) => (
//                   <input
//                       key={key}
//                       value={form[key]}
//                       placeholder={label}
//                       className="border p-2 w-full mb-3"
//                       onChange={(e) => handleChange(key, e.target.value)}
//                   />
//               ))}

//               <div className="flex justify-end gap-2 mt-4">
//                   <button onClick={onClose} className="px-4 py-2 border rounded">
//                       Cancel
//                   </button>
//                   <button
//                       onClick={() => onSave()} // Trigger the onSave when clicked
//                       className="px-4 py-2 bg-green-600 text-white rounded"
//                   >
//                       Save
//                   </button>
//               </div>
//           </div>
//       </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { adminApi } from "../../api/admin";

// export default function EditDoctor({ open, doctorId, onClose, onSave }) {
//   const [form, setForm] = useState({
//     full_name: "",
//     specialization: "",
//     experience_years: "",
//     consultation_fee: "",
//   });

//   const [loading, setLoading] = useState(false);

//   // Fetch doctor detail when modal opens
//   useEffect(() => {
//     if (!open || !doctorId) return;

//     setLoading(true);
//     adminApi.getDoctorDetail(doctorId)
//       .then((res) => {
//         setForm(res.data.doctor_profile);
//       })
//       .finally(() => setLoading(false));
//   }, [open, doctorId]);

//   const handleChange = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSave = () => {
//     onSave(form);
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-xl w-[420px]">
//         <h2 className="text-lg font-bold mb-4">Update Doctor</h2>

//         {loading ? (
//           <p className="text-center">Loading...</p>
//         ) : (
//           <>
//             {[
//               ["full_name", "Full Name"],
//               ["specialization", "Specialization"],
//               ["experience_years", "Experience Years"],
//               ["consultation_fee", "Consultation Fee"],
//             ].map(([key, label]) => (
//               <input
//                 key={key}
//                 value={form[key]}
//                 placeholder={label}
//                 className="border p-2 w-full mb-3"
//                 onChange={(e) => handleChange(key, e.target.value)}
//               />
//             ))}

//             <div className="flex justify-end gap-2 mt-4">
//               <button onClick={onClose} className="px-4 py-2 border rounded">
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 bg-green-600 text-white rounded"
//               >
//                 Save
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";

export default function EditDoctor({ open, doctor, onClose, onSave }) {
  const [form, setForm] = useState({
    full_name: "",
    specialization: "",
    experience_years: "",
    consultation_fee: "",
  });

  // Populate form when doctor changes
  useEffect(() => {
    if (doctor) {
      setForm({
        full_name: doctor.full_name || "",
        specialization: doctor.specialization || "",
        experience_years: doctor.experience_years || "",
        consultation_fee: doctor.consultation_fee || "",
      });
    }
  }, [doctor]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(form);
  };

  if (!open || !doctor) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[420px]">
        <h2 className="text-lg font-bold mb-4">Update Doctor</h2>

        {[
          ["full_name", "Full Name"],
          ["specialization", "Specialization"],
          ["experience_years", "Experience Years"],
          ["consultation_fee", "Consultation Fee"],
        ].map(([key, label]) => (
          <input
            key={key}
            value={form[key]}
            placeholder={label}
            className="border p-2 w-full mb-3"
            onChange={(e) => handleChange(key, e.target.value)}
          />
        ))}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
