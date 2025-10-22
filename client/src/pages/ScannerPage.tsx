import QRScanner from '@/components/QRScanner';

export default function ScannerPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="max-w-4xl mx-auto px-4 py-4 font-semibold">Scan QR</div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <QRScanner />
      </main>
    </div>
  );
}
