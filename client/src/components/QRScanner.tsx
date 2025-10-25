import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface PatientData {
  name: string;
  height: number;
  weight: number;
  bmi: number;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  medicalReports: Array<{
    title: string;
    url: string;
    uploadedAt: Date;
    uploadedBy: string;
    type: string;
  }>;
}

export default function QRScanner() {
  const [scannedData, setScannedData] = useState<PatientData | null>(null);
  const [error, setError] = useState<string>('');
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const qrScanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10,
        qrbox: {
          width: 250,
          height: 250
        }
      },
      /* verbose= */ false
    );

    qrScanner.render(handleScan, handleError);
    setScanner(qrScanner);

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, []);

  const handleScan = async (decodedText: string) => {
    try {
      const response = await fetch(`/api/qr/${encodeURIComponent(decodedText)}`);
      if (!response.ok) throw new Error('Failed to fetch patient data');
      
      const patientData = await response.json();
      setScannedData(patientData);
      setError('');
      
      // Stop scanning after successful scan
      if (scanner) {
        scanner.pause();
      }
    } catch (err) {
      setError('Failed to fetch patient data. Please try scanning again.');
      console.error('Error fetching patient data:', err);
    }
  };

  const handleError = (errorMessage: string) => {
    console.error('QR Scanner error:', errorMessage);
    setError('Failed to access camera. Please make sure you have granted camera permissions.');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Scan Patient QR Code</h1>
      
      {!scannedData && (
        <div className="mb-4" id="reader"></div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {scannedData && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{scannedData.name}'s Medical Information</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-medium">Physical Details</h3>
              <p>Height: {scannedData.height} cm</p>
              <p>Weight: {scannedData.weight} kg</p>
              <p>BMI: {scannedData.bmi}</p>
              <p>Blood Group: {scannedData.bloodGroup}</p>
            </div>
            
            <div>
              <h3 className="font-medium">Medical History</h3>
              <p>Allergies: {scannedData.allergies.join(', ') || 'None'}</p>
              <p>Chronic Conditions: {scannedData.chronicConditions.join(', ') || 'None'}</p>
              <p>Current Medications: {scannedData.currentMedications.join(', ') || 'None'}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Medical Reports</h3>
            <div className="space-y-2">
              {scannedData.medicalReports.map((report, index) => (
                <div key={index} className="border rounded p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{report.title}</h4>
                      <p className="text-sm text-gray-600">
                        Type: {report.type} | Uploaded by: {report.uploadedBy}
                      </p>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(report.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <a
                      href={report.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
              {scannedData.medicalReports.length === 0 && (
                <p className="text-gray-500">No medical reports available</p>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              setScannedData(null);
              if (scanner) {
                scanner.resume();
              }
            }}
            className="mt-6 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Scan Another Code
          </button>
        </div>
      )}
    </div>
  );
}