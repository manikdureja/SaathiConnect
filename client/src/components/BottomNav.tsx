import { Home, Users, User, Settings, QrCode, ScanLine } from "lucide-react";
import { Link, useLocation } from "wouter";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

export default function BottomNav() {
  const [location] = useLocation();

  const navItems: NavItem[] = [
    { icon: <Home className="h-8 w-8" />, label: "Home", path: "/" },
    { icon: <Users className="h-8 w-8" />, label: "Community", path: "/community" },
    { icon: <User className="h-8 w-8" />, label: "Profile", path: "/profile" },
    { icon: <ScanLine className="h-8 w-8" />, label: "Scan QR", path: "/scan" },
    { icon: <QrCode className="h-8 w-8" />, label: "My QR", path: "/my-qrcode" },
    { icon: <Settings className="h-8 w-8" />, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border z-50">
      <div className="flex items-center justify-around h-20 max-w-4xl mx-auto px-4">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              data-testid={`link-nav-${item.label.toLowerCase()}`}
            >
              <div
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover-elevate"
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
