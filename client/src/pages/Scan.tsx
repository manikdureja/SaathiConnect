import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import QRScanner from '@/components/QRScanner';
import QRCodeNav from '@/components/QRCodeNav';

interface MedicalReport {
  title: string;
  url: string;
  uploadedAt: string;
}

interface Patient {
  name: string;
  height: number;
  weight: number;
  bmi: number;
  bloodGroup: string;
  emergencyContact: { name: string; phoneNumber: string };
  medicalReports: MedicalReport[];
}

const Scan = () => {
  const { qrCodeId } = useParams<{ qrCodeId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPatient() {
      try {
        const res = await fetch(`/api/qr/${qrCodeId}`);
        if (!res.ok) throw new Error('Patient not found');
        const data = await res.json();
        setPatient(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPatient();
  }, [qrCodeId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!patient) return <p>No patient data.</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">{patient.name}</h1>
      <p>Height: {patient.height} cm</p>
      <p>Weight: {patient.weight} kg</p>
      <p>BMI: {patient.bmi}</p>
      <p>Blood Group: {patient.bloodGroup}</p>

      <h2 className="mt-4 font-semibold">Emergency Contact</h2>
      <p>{patient.emergencyContact.name} - {patient.emergencyContact.phoneNumber}</p>

      <h2 className="mt-4 font-semibold">Medical Reports</h2>
      {patient.medicalReports?.length ? (
        <ul className="list-disc pl-6">
          {patient.medicalReports.map((rpt: MedicalReport, idx: number) => (
            <li key={idx}>
              <a href={rpt.url} target="_blank" rel="noopener noreferrer">{rpt.title}</a> ({new Date(rpt.uploadedAt).toLocaleDateString()})
            </li>
          ))}
        </ul>
      ) : <p>No reports available.</p>}
    </div>
  );
};

export default Scan;
