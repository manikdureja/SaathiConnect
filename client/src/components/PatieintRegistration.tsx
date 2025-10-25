// src/components/PatientRegistration.tsx
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface FormData {
  name: string;
  age: string;
  phoneNumber: string;
  password: string;
  height: string;
  weight: string;
  bmi: string;
  bloodGroup: string;
  photoUrl: string;
  allergies: string;
  chronicConditions: string;
  currentMedications: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export default function PatientRegistration() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    phoneNumber: "",
    password: "",
    height: "",
    weight: "",
    bmi: "",
    bloodGroup: "",
    photoUrl: "",
    allergies: "",
    chronicConditions: "",
    currentMedications: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });
  const [reportFiles, setReportFiles] = useState<File[]>([]);

  const [qrCode, setQrCode] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setReportFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });
      reportFiles.forEach((file, idx) => {
        formPayload.append(`reportFiles`, file);
      });

      // Register user (patient) and store token
      const res = await axios.post(`/api/auth/register`, formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.token && res.data?.user) {
        const { authStorage } = await import('@/lib/auth');
        authStorage.setToken(res.data.token);
        authStorage.setUserData({ id: res.data.user.id, name: res.data.user.name, type: 'user' });
      }
      setQrCode(res.data.qrCode);
    } catch (err: any) {
      console.error("Error registering patient:", err.response?.data || err.message);
      alert("Failed to register patient. See console for details.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl mt-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Register Patient</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        {Object.keys(formData).map((field) => (
          <input
            key={field}
            type={field === 'password' ? 'password' : 'text'}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field as keyof FormData]}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        ))}
        <div>
          <label className="block mb-1 font-medium">Upload Previous Reports</label>
          <input type="file" multiple onChange={handleFileChange} className="w-full p-2 border rounded-md" />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Generate QR Code
        </button>
      </form>

      {qrCode && (
        <div className="mt-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Patient QR Code</h2>
          <img src={qrCode} alt="QR Code" className="mx-auto w-40 h-40" />
          <p className="text-sm mt-2 text-gray-600">Scan to view patient record</p>
        </div>
      )}
    </div>
  );
}
