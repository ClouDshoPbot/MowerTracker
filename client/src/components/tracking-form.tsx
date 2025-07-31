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
    <div className="relative bg-gradient-to-br from-brand-green via-brand-dark-green to-emerald-800 text-white py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-white rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-1/3 w-20 h-20 bg-white rounded-full blur-md"></div>
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
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
