import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertTrackingNumber } from "@shared/schema";

interface CreateTrackingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTrackingModal({ open, onOpenChange }: CreateTrackingModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<InsertTrackingNumber>({
    customerName: "",
    deliveryAddress: "",
    packageWeight: "",
    serviceType: "Standard Ground",
    referenceNumber: "",
    estimatedDelivery: "",
    currentStatus: "Package Received",
    currentLocation: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTrackingNumber) => {
      const response = await apiRequest("POST", "/api/admin/tracking", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tracking number created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tracking"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      onOpenChange(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create tracking number",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      customerName: "",
      deliveryAddress: "",
      packageWeight: "",
      serviceType: "Standard Ground",
      referenceNumber: "",
      estimatedDelivery: "",
      currentStatus: "Package Received",
      currentLocation: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const updateField = (field: keyof InsertTrackingNumber, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Tracking Number</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => updateField("customerName", e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <Label htmlFor="currentLocation">Initial Location</Label>
              <Input
                id="currentLocation"
                value={formData.currentLocation}
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
              value={formData.deliveryAddress}
              onChange={(e) => updateField("deliveryAddress", e.target.value)}
              placeholder="123 Main St&#10;City, State ZIP"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currentStatus">Initial Status</Label>
              <Select value={formData.currentStatus} onValueChange={(value) => updateField("currentStatus", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Package Received">Package Received</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="serviceType">Service Type</Label>
              <Select value={formData.serviceType} onValueChange={(value) => updateField("serviceType", value)}>
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
                value={formData.packageWeight}
                onChange={(e) => updateField("packageWeight", e.target.value)}
                placeholder="15.2 lbs"
              />
            </div>
            <div>
              <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
              <Input
                id="estimatedDelivery"
                value={formData.estimatedDelivery}
                onChange={(e) => updateField("estimatedDelivery", e.target.value)}
                placeholder="March 25, 2024"
              />
            </div>
            <div>
              <Label htmlFor="referenceNumber">Reference/Order Number</Label>
              <Input
                id="referenceNumber"
                value={formData.referenceNumber}
                onChange={(e) => updateField("referenceNumber", e.target.value)}
                placeholder="Order #12345"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending} className="bg-brand-green hover:bg-brand-dark-green">
              {createMutation.isPending ? "Creating..." : "Create Tracking Number"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
