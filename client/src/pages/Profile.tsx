import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import BottomNav from "@/components/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import { Phone, MapPin, Calendar } from "lucide-react";
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { authStorage } from '@/lib/auth';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    photoUrl: '',
    bloodGroup: '',
    height: '',
    weight: '',
    bmi: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    majorProblem: '',
    allergiesText: '',
    chronicConditionsText: '',
    currentMedicationsText: ''
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [, setLocation] = useLocation();

  useEffect(() => {
    async function fetchMe() {
      const me = authStorage.getUserData();
      if (!me?.id) return setLoading(false);

      try {
        const res = await fetch(`/api/user/${me.id}`);
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setUser(data);
        setForm({
          name: data.name || '',
          photoUrl: data.photoUrl || '',
          bloodGroup: data.bloodGroup || '',
          height: data.height || '',
          weight: data.weight || '',
          bmi: data.bmi || '',
          emergencyContactName: data.emergencyContact?.name || '',
          emergencyContactPhone: data.emergencyContact?.phoneNumber || '',
          majorProblem: data.majorProblem || '',
          allergiesText: Array.isArray(data.allergies) ? data.allergies.join('\n') : '',
          chronicConditionsText: Array.isArray(data.chronicConditions) ? data.chronicConditions.join('\n') : '',
          currentMedicationsText: Array.isArray(data.currentMedications) ? data.currentMedications.join('\n') : ''
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
    // listen for openProfileEdit event (fired from Home)
    const onOpen = () => {
      setOpen(true);
      setEditing(true);
    };
    window.addEventListener('openProfileEdit', onOpen as any);
    return () => window.removeEventListener('openProfileEdit', onOpen as any);
  }, []);

  const initials = (user?.name || 'NA')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  // auto-calc BMI whenever height(cm) or weight(kg) changes
  useEffect(() => {
    const h = Number(form.height);
    const w = Number(form.weight);
    if (h > 0 && w > 0) {
      const heightMeters = h / 100;
      const calc = w / (heightMeters * heightMeters);
      const rounded = Math.round(calc * 10) / 10;
      setForm(prev => ({ ...prev, bmi: String(rounded) }));
    }
  }, [form.height, form.weight]);

  const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });

  const save = async () => {
    try {
      const me = authStorage.getUserData();
      if (!me?.id) return alert('Not authenticated');
      const token = authStorage.getToken();
      let res;
      if (photoFile) {
        const fd = new FormData();
        fd.append('photo', photoFile);
        fd.append('name', form.name);
        fd.append('bloodGroup', form.bloodGroup);
        fd.append('height', String(form.height));
        fd.append('weight', String(form.weight));
        fd.append('bmi', String(form.bmi));
        fd.append('emergencyContactName', form.emergencyContactName);
        fd.append('emergencyContactPhone', form.emergencyContactPhone);
        fd.append('majorProblem', form.majorProblem);
        // include list fields as newline-separated strings; server will parse
        fd.append('allergies', form.allergiesText || '');
        fd.append('chronicConditions', form.chronicConditionsText || '');
        fd.append('currentMedications', form.currentMedicationsText || '');
        res = await fetch(`/api/user/${me.id}/profile`, {
          method: 'PUT',
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: fd,
        });
      } else {
        // fallback to JSON
        const payload = {
          name: form.name,
          photoUrl: form.photoUrl,
          bloodGroup: form.bloodGroup,
          height: form.height,
          weight: form.weight,
          bmi: form.bmi,
          emergencyContactName: form.emergencyContactName,
          emergencyContactPhone: form.emergencyContactPhone,
          majorProblem: form.majorProblem
          ,allergies: form.allergiesText,
          chronicConditions: form.chronicConditionsText,
          currentMedications: form.currentMedicationsText
        };
        res = await fetch(`/api/user/${me.id}/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setUser(updated);
      setEditing(false);
      alert('Saved');
    } catch (err: any) {
      alert('Failed: ' + err.message);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Card className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <h2 className="text-3xl font-bold" data-testid="text-user-name">
                {user?.name}
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-5 w-5" />
                  <span className="text-lg" data-testid="text-user-phone">
                    {user?.phoneNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">{user?.location || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <span className="text-lg">Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-2xl font-semibold">Profile Details</h3>

          {!editing && (
              <div className="space-y-2">
              <p className="text-lg">Name: <span className="font-medium">{user?.name}</span></p>
              <p className="text-lg">Blood group: <span className="font-medium">{user?.bloodGroup || '—'}</span></p>
              <p className="text-lg">Height: <span className="font-medium">{user?.height || '—'} cm</span></p>
              <p className="text-lg">Weight: <span className="font-medium">{user?.weight || '—'} kg</span></p>
              <p className="text-lg">BMI: <span className="font-medium">{user?.bmi || '—'}</span></p>
              <p className="text-lg">Emergency Contact: <span className="font-medium">{user?.emergencyContact?.name || '—'} — {user?.emergencyContact?.phoneNumber || '—'}</span></p>
              <p className="text-lg">Major Problem: <span className="font-medium">{user?.majorProblem || '—'}</span></p>
              <p className="text-lg">Allergies: <span className="font-medium">{Array.isArray(user?.allergies) && user?.allergies.length > 0 ? user.allergies.join(', ') : 'None'}</span></p>
              <p className="text-lg">Chronic Conditions: <span className="font-medium">{Array.isArray(user?.chronicConditions) && user?.chronicConditions.length > 0 ? user.chronicConditions.join(', ') : 'None'}</span></p>
              <p className="text-lg">Current Medications: <span className="font-medium">{Array.isArray(user?.currentMedications) && user?.currentMedications.length > 0 ? user.currentMedications.join(', ') : 'None'}</span></p>
              <Button onClick={() => { setEditing(true); setOpen(true); }}>Edit Profile</Button>
            </div>
          )}

          {/* Edit modal */}
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(false); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>Update your profile information</DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Name" />
                <div>
                  <label className="block text-sm font-medium mb-1">Upload Photo</label>
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setPhotoFile(f);
                    const dataUrl = await fileToDataUrl(f);
                    setForm(prev => ({ ...prev, photoUrl: dataUrl }));
                  }} />
                </div>
                <input name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Blood group" />
                <div>
                  <label className="block text-sm font-medium mb-1">Height (int cm)</label>
                  <input name="height" value={form.height} onChange={handleChange} type="number" inputMode="numeric" min="0" step="1" className="w-full p-2 border rounded" placeholder="Height (cm)" />
                </div>
                <input name="weight" value={form.weight} onChange={handleChange} type="number" inputMode="decimal" min="0" step="0.1" className="w-full p-2 border rounded" placeholder="Weight (kg)" />
                <input name="bmi" value={form.bmi} readOnly className="w-full p-2 border rounded bg-muted" placeholder="BMI (auto)" />
                <div className="grid grid-cols-2 gap-2">
                  <input name="emergencyContactName" value={form.emergencyContactName || ''} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Emergency contact name" />
                  <input name="emergencyContactPhone" value={form.emergencyContactPhone || ''} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Emergency contact phone" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Any major problem / organ issue</label>
                  <textarea name="majorProblem" value={form.majorProblem} onChange={handleChange} className="w-full p-2 border rounded" rows={3} placeholder="Describe any major health issues or organ concerns" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Allergies / None</label>
                  <textarea name="allergiesText" value={form.allergiesText} onChange={handleChange} className="w-full p-2 border rounded" rows={3} placeholder="List allergies, one per line" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Chronic Conditions / None</label>
                  <textarea name="chronicConditionsText" value={form.chronicConditionsText} onChange={handleChange} className="w-full p-2 border rounded" rows={3} placeholder="List chronic conditions, one per line" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Medications / None</label>
                  <textarea name="currentMedicationsText" value={form.currentMedicationsText} onChange={handleChange} className="w-full p-2 border rounded" rows={3} placeholder="List current medications, one per line" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={save}>Save</Button>
                  <Button variant="outline" onClick={() => { setEditing(false); setOpen(false); }}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </Card>

      </main>

      <BottomNav />
    </div>
  );
}

function ReportUploadForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });

  const upload = async () => {
    try {
      const token = authStorage.getToken();
      let res;
      if (file) {
        const fd = new FormData();
        fd.append('report', file);
        // optional title
        if (title) fd.append('title', title);
        res = await fetch(`/api/user/${userId}/report`, {
          method: 'POST',
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: fd,
        });
      } else {
        let payload: any = { title, url };
        const res2 = await fetch(`/api/user/${userId}/report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(payload),
        });
        res = res2;
      }
      if (!res.ok) throw new Error(await res.text());
      alert('Uploaded');
      setTitle(''); setUrl('');
      setFile(null);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    }
  };

  return (
    <div className="mt-4">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Report title (optional)" className="w-full p-2 border rounded mb-2" />
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Report URL (or leave blank if uploading file)" className="w-full p-2 border rounded mb-2" />
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Upload file</label>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        {file && <div className="text-sm text-muted-foreground mt-1">Selected: {file.name}</div>}
      </div>
      <Button onClick={upload}>Upload Report</Button>
    </div>
  );
}
