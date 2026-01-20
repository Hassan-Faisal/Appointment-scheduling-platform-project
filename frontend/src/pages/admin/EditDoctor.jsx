
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
