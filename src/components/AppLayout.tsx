import { Package } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { cn } from "../utils/utils";
import { Button } from "./ui/Button";

interface TAppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: TAppLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-gray-900 hover:text-blue-600 transition-colors">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-lg">Product Explorer</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            <Link
              to="/"
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === "/" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100",
              )}
            >
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user && <span className="hidden sm:block text-sm text-gray-500">{user.username}</span>}
            <Button variant="secondary" size="sm" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
