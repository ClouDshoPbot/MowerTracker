import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TrackingFormProps {
  onTrack: (trackingNumber: string) => void;
  isLoading?: boolean;
}

export default function TrackingForm({ onTrack, isLoading }: TrackingFormProps) {
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      onTrack(trackingNumber.trim());
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-brand-green via-brand-dark-green to-emerald-900 text-white py-24 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute top-16 left-16 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-24 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-24 left-1/4 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-16 right-1/3 w-24 h-24 bg-white rounded-full blur-xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl opacity-5 animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>
      
      {/* Geometric Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M0 40a40 40 0 1 1 80 0 40 40 0 0 1-80 0zm40-32a32 32 0 1 0 0 64 32 32 0 0 0 0-64zm0 8a24 24 0 1 1 0 48 24 24 0 0 1 0-48zm0 8a16 16 0 1 0 0 32 16 16 0 0 0 0-32z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Truck/Package Icons Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-white text-4xl animate-pulse" style={{animationDelay: '3s'}}>📦</div>
        <div className="absolute top-32 right-32 text-white text-3xl animate-pulse" style={{animationDelay: '1.5s'}}>🚚</div>
        <div className="absolute bottom-28 left-32 text-white text-3xl animate-pulse" style={{animationDelay: '2.5s'}}>📦</div>
        <div className="absolute bottom-20 right-20 text-white text-4xl animate-pulse" style={{animationDelay: '0.8s'}}>🚛</div>
        <div className="absolute top-1/2 right-16 text-white text-2xl animate-pulse" style={{animationDelay: '4s'}}>📦</div>
      </div>
      
      {/* Subtle Lines Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1'%3E%3Cpath d='M0 50h100M50 0v100M25 0v100M75 0v100M0 25h100M0 75h100'/%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl font-bold mb-6 drop-shadow-lg">Track Your Package</h2>
        <p className="text-xl mb-10 opacity-95 max-w-2xl mx-auto leading-relaxed">Enter your tracking number to get real-time updates on your mower delivery</p>
        
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="flex shadow-2xl rounded-xl overflow-hidden backdrop-blur-sm bg-white/10 p-2">
            <Input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number (e.g., MTK123456789)"
              className="flex-1 px-6 py-4 text-gray-900 bg-white/95 border-0 focus:ring-2 focus:ring-white/50 focus:outline-none text-lg placeholder-gray-500 rounded-lg mr-2"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !trackingNumber.trim()}
              className="bg-white text-brand-green px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg text-lg"
            >
              <Search className="mr-2" size={18} />
              {isLoading ? "Tracking..." : "Track"}
            </Button>
          </div>
          
          {/* Sample tracking numbers */}
          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm mb-2">Try a sample tracking number:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button 
                type="button"
                onClick={() => setTrackingNumber("MTK123456789")}
                className="px-3 py-1 bg-white/20 text-white text-xs rounded-full hover:bg-white/30 transition-colors"
              >
                MTK123456789
              </button>
              <button 
                type="button"
                onClick={() => setTrackingNumber("MTK987654321")}
                className="px-3 py-1 bg-white/20 text-white text-xs rounded-full hover:bg-white/30 transition-colors"
              >
                MTK987654321
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
