
  

// export default function AppointmentTable({ data, role }) {
//   return (
//     <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
//       <thead className="bg-gray-100">
//         <tr>
//           <th className="text-left p-3">Doctor/Patient</th>
//           <th className="text-left p-3">Date</th>
//           <th className="text-left p-3">Time</th>
//           <th className="text-left p-3">Status</th>
//           <th className="text-left p-3">Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((appt) => {
//           console.log(appt); // Log the appointment data to check the structure
//           return (
//             <tr key={appt.id} className="border-b">
//               <td className="p-3">
//                 {role === "patient" ? appt.doctor_name : appt.patient_name}
//               </td>
//               <td className="p-3">{appt.appointment_date}</td>
//               <td className="p-3">{appt.start_time}</td>
//               <td className="p-3">{appt.status}</td>
//               <td className="p-3">
//                 {role === "patient" && appt.status === "booked" && (
//                   <button className="px-3 py-1 bg-danger text-white rounded">
//                     Cancel
//                   </button>
//                 )}
//               </td>
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   );
// }


export default function AppointmentTable({ data, role, onCancel }) {
  return (
    <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="text-left p-3">Doctor/Patient</th>
          <th className="text-left p-3">Date</th>
          <th className="text-left p-3">Time</th>
          <th className="text-left p-3">Status</th>
          <th className="text-left p-3">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((appt) => {
          console.log(appt); // Log the appointment data to check the structure
          return (
            <tr key={appt.id} className="border-b">
              <td className="p-3">
                {role === "patient" ? appt.doctor_name : appt.patient_name}
              </td>
              <td className="p-3">{appt.appointment_date}</td>
              <td className="p-3">{appt.start_time}</td>
              <td className="p-3">{appt.status}</td>
              <td className="p-3">
                {role === "patient" && appt.status === "booked" && (
                  <button
                    onClick={() => onCancel(appt.id)} // Call onCancel with appointment ID
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
