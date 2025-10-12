import { useState } from 'react';
import AuthForm from '../AuthForm';

export default function AuthFormExample() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="p-6 bg-background min-h-screen flex items-center justify-center">
      <AuthForm 
        mode={mode}
        onSubmit={(data) => console.log('Auth submitted:', data)}
        onToggleMode={() => setMode(mode === 'login' ? 'register' : 'login')}
      />
    </div>
  );
}
