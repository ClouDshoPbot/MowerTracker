import { Shield, Clock, Truck, Headphones } from "lucide-react";

export default function TrustIndicators() {
  const indicators = [
    {
      icon: Headphones,
      title: "24/7 Customer Support",
      description: "We're here to help anytime, day or night!"
    },
    {
      icon: Shield,
      title: "Secure Tracking",
      description: "Your package information is protected"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Get instant notifications on your package"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable shipping service"
    }
  ];

  return (
    <div className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {indicators.map((indicator, index) => (
            <div key={index} className="text-center">
              <div className="bg-brand-light-green w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <indicator.icon className="text-2xl text-brand-green" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{indicator.title}</h3>
              <p className="text-gray-600 text-sm">{indicator.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
