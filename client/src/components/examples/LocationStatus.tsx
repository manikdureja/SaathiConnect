import LocationStatus from '../LocationStatus';

export default function LocationStatusExample() {
  return (
    <div className="p-6 bg-background space-y-4">
      <LocationStatus enabled={true} location="Mumbai, Maharashtra" />
      <LocationStatus enabled={false} />
    </div>
  );
}
