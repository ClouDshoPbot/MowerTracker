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
    <div className="bg-gradient-to-br from-brand-green to-brand-dark-green text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-4">Track Your Package</h2>
        <p className="text-xl mb-8 opacity-90">Enter your tracking number to get real-time updates</p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex">
            <Input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number (e.g., MTK123456789)"
              className="flex-1 px-4 py-3 text-gray-900 bg-white rounded-l-lg border-0 focus:ring-2 focus:ring-white focus:outline-none"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !trackingNumber.trim()}
              className="bg-white text-brand-green px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-50 transition-colors rounded-l-none"
            >
              <Search className="mr-2" size={16} />
              {isLoading ? "Tracking..." : "Track"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
