import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Truck, Shield, ArrowLeft, Phone, Mail, Globe } from "lucide-react";
import TrackingForm from "@/components/tracking-form";
import TrackingResults from "@/components/tracking-results";
import TrustIndicators from "@/components/trust-indicators";
import type { TrackingWithEvents } from "@shared/schema";

export default function Home() {
  const [searchedTrackingNumber, setSearchedTrackingNumber] = useState<string>("");

  // Check URL for tracking parameter on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const trackParam = urlParams.get('track');
    if (trackParam) {
      setSearchedTrackingNumber(trackParam);
    }
  }, []);

  // Fetch tracking data when a tracking number is searched
  const { data: trackingData, isLoading, error, refetch } = useQuery<TrackingWithEvents>({
    queryKey: ["/api/tracking", searchedTrackingNumber],
    enabled: !!searchedTrackingNumber,
  });

  const handleTrack = (trackingNumber: string) => {
    setSearchedTrackingNumber(trackingNumber);
    // Update URL without page reload
    const newUrl = trackingNumber ? `/?track=${trackingNumber}` : '/';
    window.history.pushState({}, '', newUrl);
    refetch();
  };

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
              <span className="text-sm text-gray-500 hidden sm:block">by xmowers.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden md:block">
                Need help? Call +1 786 358 5613
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Tracking Form */}
      <TrackingForm onTrack={handleTrack} isLoading={isLoading} />

      {/* Tracking Results */}
      {searchedTrackingNumber && (
        <div className="py-8">
          {isLoading && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
                <p className="text-gray-600">Searching for tracking information...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-red-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tracking Number Not Found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any information for tracking number: <strong>{searchedTrackingNumber}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Please check the tracking number and try again, or contact customer support.
                </p>
              </div>
            </div>
          )}
          
          {trackingData && <TrackingResults tracking={trackingData} />}
        </div>
      )}

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* How to Track Instructions */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How to Track Your Package</h3>
            <p className="text-gray-600 text-lg">Follow these simple steps to track your MowersTrack shipment</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Enter Tracking Number",
                description: "Input your MTK tracking number in the search box above"
              },
              {
                step: 2,
                title: "View Real-time Updates",
                description: "See the current status and location of your package"
              },
              {
                step: 3,
                title: "Get Delivery Updates",
                description: "Receive notifications when your package is delivered"
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="bg-brand-green text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="text-2xl text-brand-green" size={28} />
                <h3 className="text-xl font-bold">MowersTrack</h3>
              </div>
              <p className="text-gray-300 text-sm">Professional package tracking service by xmowers.com</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <Phone size={14} />
                  <span>+1 786 358 5613</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={14} />
                  <span>support@xmowers.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe size={14} />
                  <span>xmowers.com</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div>Package Tracking</div>
                <div>Delivery Updates</div>
                <div>24/7 Support</div>
                <div>Mobile Tracking</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div><a href="#" className="hover:text-brand-green transition-colors">Track Package</a></div>
                <div><a href="https://xmowers.com" className="hover:text-brand-green transition-colors">Visit xmowers.com</a></div>
                <div><a href="#" className="hover:text-brand-green transition-colors">Help Center</a></div>
                <div><a href="#" className="hover:text-brand-green transition-colors">Contact Us</a></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 MowersTrack by xmowers.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
