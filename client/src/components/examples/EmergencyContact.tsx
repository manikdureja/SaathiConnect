import EmergencyContact from '../EmergencyContact';

export default function EmergencyContactExample() {
  return (
    <div className="p-6 bg-background">
      <EmergencyContact 
        name="Ramesh Kumar"
        phoneNumber="+91 98765 43210"
        onEdit={() => console.log('Edit contact')}
        onCall={() => console.log('Call contact')}
      />
    </div>
  );
}
