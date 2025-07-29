import { TrackingWithEvents } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { getStatusColor, formatDate } from "@/lib/tracking";

interface TrackingResultsProps {
  tracking: TrackingWithEvents;
}

export default function TrackingResults({ tracking }: TrackingResultsProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <Card className="overflow-hidden shadow-lg">
        {/* Package Info Header */}
        <div className="bg-gradient-to-r from-brand-green to-brand-dark-green text-white p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">Package Details</h3>
              <p className="opacity-90">
                Tracking Number: <span className="font-mono font-semibold">{tracking.trackingNumber}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <p className="text-sm opacity-90 mb-1">Current Status</p>
                <p className="font-semibold text-lg">{tracking.currentStatus}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Delivery */}
        {tracking.estimatedDelivery && (
          <div className="bg-brand-light-green p-4">
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="text-brand-green" size={20} />
              <span className="font-semibold text-gray-900">Estimated Delivery: </span>
              <span className="font-bold text-brand-dark-green">{tracking.estimatedDelivery}</span>
            </div>
          </div>
        )}

        <CardContent className="p-6">
          {/* Tracking Timeline */}
          <h4 className="text-xl font-semibold text-gray-900 mb-6">Tracking History</h4>
          <div className="space-y-6">
            {tracking.events.length > 0 ? (
              tracking.events.map((event, index) => (
                <div key={event.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full mt-1.5 ${
                      index === 0 ? 'bg-brand-green' : 'bg-gray-300'
                    }`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p className="font-semibold text-gray-900">{event.status}</p>
                      <span className="text-sm text-gray-500">{event.timestamp}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{event.location}</p>
                    {event.description && (
                      <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No tracking events available</p>
            )}
          </div>
        </CardContent>

        {/* Additional Info */}
        <div className="bg-gray-50 p-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Delivery Address</h5>
              <div className="text-gray-600 text-sm whitespace-pre-line">
                {tracking.customerName && <div className="font-medium">{tracking.customerName}</div>}
                {tracking.deliveryAddress}
              </div>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Package Info</h5>
              <div className="text-gray-600 text-sm space-y-1">
                {tracking.packageWeight && (
                  <div>Weight: <span className="font-medium">{tracking.packageWeight}</span></div>
                )}
                <div>Service: <span className="font-medium">{tracking.serviceType}</span></div>
                {tracking.referenceNumber && (
                  <div>Reference: <span className="font-medium">{tracking.referenceNumber}</span></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
