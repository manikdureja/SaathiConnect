import { useEffect, useState } from 'react';
import { authStorage } from '@/lib/auth';

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  email: string;
  photoUrl?: string;
}

export default function HospitalDashboard() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const user = authStorage.getUserData();

  useEffect(() => {
    async function fetchDoctors() {
      if (!user) return;
      try {
        const res = await fetch(`/api/hospital/${user.id}/doctors`);
        const data = await res.json();
        setDoctors(data || []);
      } catch (err) {
        console.error('Failed to fetch doctors', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, [user]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Hospital Doctors</h1>
      {doctors.length === 0 && <p>No doctors registered yet.</p>}
      <div className="grid grid-cols-1 gap-4">
        {doctors.map((d) => (
          <div key={d._id} className="p-4 border rounded flex items-center gap-4">
            {d.photoUrl ? <img src={d.photoUrl} alt={d.name} className="w-16 h-16 rounded-full object-cover" /> : <div className="w-16 h-16 rounded-full bg-gray-200" />}
            <div>
              <div className="font-semibold">{d.name}</div>
              <div className="text-sm text-gray-600">{d.specialization}</div>
              <div className="text-sm text-gray-600">{d.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}