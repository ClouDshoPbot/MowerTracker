export const statusColors = {
  "Package Received": "bg-blue-100 text-blue-800",
  "Processing": "bg-yellow-100 text-yellow-800",
  "In Transit": "bg-purple-100 text-purple-800",
  "Arrived at local facility": "bg-orange-100 text-orange-800",
  "Out for Delivery": "bg-yellow-100 text-yellow-800",
  "Delivered": "bg-green-100 text-green-800",
  "Exception": "bg-red-100 text-red-800",
} as const;

export const getStatusColor = (status: string): string => {
  const key = Object.keys(statusColors).find(k => status.includes(k));
  return key ? statusColors[key as keyof typeof statusColors] : "bg-gray-100 text-gray-800";
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return dateString;
  }
};

export const generateTrackingNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `MTK${timestamp}${random}`;
};
