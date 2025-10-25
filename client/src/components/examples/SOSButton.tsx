import SOSButton from '../SOSButton';

export default function SOSButtonExample() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <SOSButton onClick={() => console.log('SOS triggered')} />
    </div>
  );
}
