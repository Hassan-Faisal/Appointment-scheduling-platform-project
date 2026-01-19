// export default function SlotButton({ time, available }) {
//     return (
//       <button
//         className={`px-4 py-2 rounded-lg text-sm m-1
//           ${available ? "bg-accent text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
//         disabled={!available}
//       >
//         {time}
//       </button>
//     );
//   }
  

// export default function SlotButton({ time, available, disabled, onClick }) {
//   return (
//     <button
//       disabled={disabled}
//       onClick={onClick}
//       className={`px-4 py-2 rounded-lg text-sm m-1
//         ${
//           available
//             ? "bg-accent text-white hover:bg-accent/90"
//             : "bg-gray-300 text-gray-600 cursor-not-allowed"
//         }`}
//     >
//       {time}
//     </button>
//   );
// }


// export default function SlotButton({ time, available, onClick }) {
//   return (
//     <button
//       onClick={available ? onClick : undefined}
//       disabled={!available}
//       className={`px-4 py-2 rounded-lg text-sm m-1 transition
//         ${
//           available
//             ? "bg-accent text-white hover:opacity-90"
//             : "bg-gray-300 text-gray-600 cursor-not-allowed"
//         }`}
//     >
//       {time}
//     </button>
//   );
// }

export default function SlotButton({ time, available, onClick }) {
  return (
    <button
      onClick={available ? onClick : undefined}
      disabled={!available}
      className={`px-4 py-2 rounded-lg text-sm m-1 transition
        ${
          available
            ? "bg-accent text-white hover:bg-accent/90"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
    >
      {time}
    </button>
  );
}
