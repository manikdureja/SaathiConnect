import { useEffect, useState } from 'react';
import { useParams } from 'wouter';

export default function DoctorProfile() {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', photoUrl: '', bloodGroup: '' });

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await fetch(`/api/doctor/${id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setDoctor(data);
        setForm({ name: data.name || '', photoUrl: data.photoUrl || '', bloodGroup: data.bloodGroup || '' });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDoctor();
  }, [id]);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const { authStorage } = await import('@/lib/auth');
      const token = authStorage.getToken();
      const res = await fetch(`/api/doctor/${id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      alert('Profile updated');
    } catch (err: any) {
      alert('Failed: ' + err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!doctor) return <p>Doctor not found</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Edit Doctor Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" />
        <input name="photoUrl" value={form.photoUrl} onChange={handleChange} placeholder="Photo URL" className="w-full p-2 border rounded" />
        <input name="bloodGroup" value={form.bloodGroup} onChange={handleChange} placeholder="Blood Group" className="w-full p-2 border rounded" />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Save</button>
      </form>
    </div>
  );
}