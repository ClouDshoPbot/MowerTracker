import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Trash2, Edit, Clock } from "lucide-react";
import type { InsertTrackingNumber, TrackingNumber, TrackingEvent, InsertTrackingEvent } from "@shared/schema";

interface EditTrackingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trackingId: string | null;
}

export default function EditTrackingModal({ open, onOpenChange, trackingId }: EditTrackingModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<Partial<InsertTrackingNumber>>({});
  const [newEvent, setNewEvent] = useState<Partial<InsertTrackingEvent>>({
    status: "",
    location: "",
    description: "",
    timestamp: ""
  });

  // Fetch tracking data when modal opens
  const { data: trackings } = useQuery<TrackingNumber[]>({
    queryKey: ["/api/admin/tracking"],
    enabled: open && !!trackingId,
  });

  // Fetch tracking events
  const { data: events = [], refetch: refetchEvents } = useQuery<TrackingEvent[]>({
    queryKey: ["/api/admin/tracking", trackingId, "events"],
    enabled: open && !!trackingId,
  });

  const tracking = trackings?.find(t => t.id === trackingId);

  useEffect(() => {
    if (tracking) {
      setFormData({
        customerName: tracking.customerName,
        deliveryAddress: tracking.deliveryAddress,
        packageWeight: tracking.packageWeight || "",
        serviceType: tracking.serviceType,
        referenceNumber: tracking.referenceNumber || "",
        estimatedDelivery: tracking.estimatedDelivery || "",
        currentStatus: tracking.currentStatus,
        currentLocation: tracking.currentLocation,
      });
    }
  }, [tracking]);

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<InsertTrackingNumber>) => {
      const response = await apiRequest("PATCH", `/api/admin/tracking/${trackingId}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tracking number updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tracking"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update tracking number",
        variant: "destructive",
      });
    },
  });

  const addEventMutation = useMutation({
    mutationFn: async (data: InsertTrackingEvent) => {
      const response = await apiRequest("POST", `/api/admin/tracking/${trackingId}/events`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tracking event added successfully",
      });
      refetchEvents();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tracking"] });
      setNewEvent({ status: "", location: "", description: "", timestamp: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add tracking event",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId) {
      updateMutation.mutate(formData);
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId && newEvent.status && newEvent.location) {
      const timestamp = newEvent.timestamp || new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true 
      });
      
      addEventMutation.mutate({
        trackingNumberId: trackingId,
        status: newEvent.status,
        location: newEvent.location,
        description: newEvent.description || "",
        timestamp,
      });
    }
  };

  const updateField = (field: keyof InsertTrackingNumber, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateEventField = (field: keyof InsertTrackingEvent, value: string) => {
    setNewEvent(prev => ({ ...prev, [field]: value }));
  };

  if (!tracking) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Tracking Number: {tracking.trackingNumber}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Package Details</TabsTrigger>
            <TabsTrigger value="events">Tracking Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName || ""}
                    onChange={(e) => updateField("customerName", e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currentLocation">Current Location</Label>
                  <Input
                    id="currentLocation"
                    value={formData.currentLocation || ""}
                    onChange={(e) => updateField("currentLocation", e.target.value)}
                    placeholder="Miami, FL Distribution Center"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="deliveryAddress">Delivery Address</Label>
                <Textarea
                  id="deliveryAddress"
                  value={formData.deliveryAddress || ""}
                  onChange={(e) => updateField("deliveryAddress", e.target.value)}
                  placeholder="123 Main St&#10;City, State ZIP"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentStatus">Current Status</Label>
                  <Select value={formData.currentStatus || ""} onValueChange={(value) => updateField("currentStatus", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Package Received">Package Received</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="In Transit">In Transit</SelectItem>
                      <SelectItem value="Arrived at local facility">Arrived at local facility</SelectItem>
                      <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Exception">Exception</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select value={formData.serviceType || ""} onValueChange={(value) => updateField("serviceType", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard Ground">Standard Ground</SelectItem>
                      <SelectItem value="Express">Express</SelectItem>
                      <SelectItem value="Next Day">Next Day</SelectItem>
                      <SelectItem value="Two Day">Two Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="packageWeight">Package Weight</Label>
                  <Input
                    id="packageWeight"
                    value={formData.packageWeight || ""}
                    onChange={(e) => updateField("packageWeight", e.target.value)}
                    placeholder="15.2 lbs"
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
                  <Input
                    id="estimatedDelivery"
                    value={formData.estimatedDelivery || ""}
                    onChange={(e) => updateField("estimatedDelivery", e.target.value)}
                    placeholder="March 25, 2024"
                  />
                </div>
                <div>
                  <Label htmlFor="referenceNumber">Reference/Order Number</Label>
                  <Input
                    id="referenceNumber"
                    value={formData.referenceNumber || ""}
                    onChange={(e) => updateField("referenceNumber", e.target.value)}
                    placeholder="Order #12345"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending} className="bg-brand-green hover:bg-brand-dark-green">
                  {updateMutation.isPending ? "Updating..." : "Update Package Details"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            {/* Add New Event */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus size={20} />
                  <span>Add New Tracking Event</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventStatus">Status</Label>
                      <Select value={newEvent.status || ""} onValueChange={(value) => updateEventField("status", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Package received at facility">Package received at facility</SelectItem>
                          <SelectItem value="In transit to destination">In transit to destination</SelectItem>
                          <SelectItem value="Arrived at local facility">Arrived at local facility</SelectItem>
                          <SelectItem value="Out for delivery">Out for delivery</SelectItem>
                          <SelectItem value="Delivered successfully">Delivered successfully</SelectItem>
                          <SelectItem value="Delivery attempted">Delivery attempted</SelectItem>
                          <SelectItem value="Exception occurred">Exception occurred</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="eventLocation">Location</Label>
                      <Input
                        id="eventLocation"
                        value={newEvent.location || ""}
                        onChange={(e) => updateEventField("location", e.target.value)}
                        placeholder="Miami, FL Distribution Center"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="eventDescription">Description (optional)</Label>
                    <Textarea
                      id="eventDescription"
                      value={newEvent.description || ""}
                      onChange={(e) => updateEventField("description", e.target.value)}
                      placeholder="Additional details about this event"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventTimestamp">Custom Timestamp (optional)</Label>
                    <Input
                      id="eventTimestamp"
                      value={newEvent.timestamp || ""}
                      onChange={(e) => updateEventField("timestamp", e.target.value)}
                      placeholder="March 24, 2024 - 6:45 AM (leave empty for current time)"
                    />
                  </div>
                  <Button type="submit" disabled={addEventMutation.isPending || !newEvent.status || !newEvent.location} className="bg-brand-green hover:bg-brand-dark-green">
                    {addEventMutation.isPending ? "Adding..." : "Add Event"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Separator />

            {/* Existing Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock size={20} />
                  <span>Tracking History ({events.length} events)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.length > 0 ? (
                    events.map((event, index) => (
                      <div key={event.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant={index === 0 ? "default" : "secondary"} className={index === 0 ? "bg-brand-green" : ""}>
                                {event.status}
                              </Badge>
                              <span className="text-sm text-gray-500">{event.timestamp}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 mb-1">{event.location}</p>
                            {event.description && (
                              <p className="text-sm text-gray-600">{event.description}</p>
                            )}
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                              <Edit size={14} />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900">
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No tracking events yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}