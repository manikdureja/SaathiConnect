import BottomNav from '../BottomNav';
import { Router } from 'wouter';

export default function BottomNavExample() {
  return (
    <Router>
      <div className="bg-background min-h-screen pb-20">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Sample Page Content</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Click the navigation items below to see the active state
          </p>
        </div>
        <BottomNav />
      </div>
    </Router>
  );
}
