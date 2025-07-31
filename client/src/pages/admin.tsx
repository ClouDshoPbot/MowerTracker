import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Truck, ArrowLeft, LogOut } from "lucide-react";
import AdminDashboard from "@/components/admin-dashboard";
import AdminLogin from "@/components/admin-login";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem("admin_authenticated");
    setIsAuthenticated(authStatus === "true");
    setIsLoading(false);
  }, []);

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Truck className="text-2xl text-brand-green" size={28} />
                <h1 className="text-2xl font-bold text-gray-900">MowersTrack</h1>
              </div>
              <span className="text-sm text-gray-500 hidden sm:block">Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden md:block">
                Need help? Call +1 786 358 5613
              </span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2" size={16} />
                Logout
              </Button>
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2" size={16} />
                  Back to Tracking
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <AdminDashboard />
    </div>
  );
}
