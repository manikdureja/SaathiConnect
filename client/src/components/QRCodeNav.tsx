import { Link, useLocation } from 'wouter';

export default function QRCodeNav() {
  const [location] = useLocation();

  return (
    <div className="flex justify-center space-x-4 mb-6">
      <Link href="/scan">
        <a className={`px-4 py-2 rounded-lg ${
          location === '/scan' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-secondary hover:bg-secondary/80'
        }`}>
          Scan QR Code
        </a>
      </Link>
      <Link href="/my-qrcode">
        <a className={`px-4 py-2 rounded-lg ${
          location === '/my-qrcode'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary hover:bg-secondary/80'
        }`}>
          My QR Code
        </a>
      </Link>
    </div>
  );
}