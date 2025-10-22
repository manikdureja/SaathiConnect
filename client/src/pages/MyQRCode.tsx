import React, { useEffect, useState } from 'react';
import { authStorage } from '@/lib/auth';
import QRCodeNav from '@/components/QRCodeNav';

interface UserData {
  name: string;
  height: number;
  weight: number;
  bmi: number;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
}

const MyQRCode = () => {
  const [qrImage, setQrImage] = useState<string>('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      try {
        const user = authStorage.getUserData();
        if (!user?.id) {
          setError('User not authenticated');
          return;
        }

        // Fetch QR Code
        const qrRes = await fetch(`/api/user/${user.id}/qrcode`);
        if (!qrRes.ok) throw new Error('Failed to fetch QR code');
        const qrData = await qrRes.json();
        setQrImage(qrData.qrImage);

        // Fetch user data
        const userRes = await fetch(`/api/user/${user.id}`);
        if (!userRes.ok) throw new Error('Failed to fetch user data');
        const userData = await userRes.json();
        setUserData(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <QRCodeNav />
      <h1 className="text-2xl font-bold mb-6 text-center">My Medical QR Code</h1>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {qrImage && (
          <div className="p-6 text-center border-b">
            <img src={qrImage} alt="QR Code" className="mx-auto w-48 h-48" />
            <p className="mt-2 text-sm text-gray-600">Scan this code to view your medical information</p>
          </div>
        )}

        {userData && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Medical Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Height</p>
                  <p className="font-medium">{userData.height} cm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-medium">{userData.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">BMI</p>
                  <p className="font-medium">{userData.bmi}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Blood Group</p>
                  <p className="font-medium">{userData.bloodGroup}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Allergies</p>
                <p className="font-medium">{Array.isArray(userData.allergies) && userData.allergies.length > 0 ? userData.allergies.join(', ') : 'None'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Chronic Conditions</p>
                <p className="font-medium">{Array.isArray(userData.chronicConditions) && userData.chronicConditions.length > 0 ? userData.chronicConditions.join(', ') : 'None'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Current Medications</p>
                <p className="font-medium">{Array.isArray(userData.currentMedications) && userData.currentMedications.length > 0 ? userData.currentMedications.join(', ') : 'None'}</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                This information will be accessible to healthcare providers when they scan your QR code.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQRCode;
