import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Download, Settings, Edit, Eye, Trash2, Package, Truck, CheckCircle } from "lucide-react";
import { getStatusColor } from "@/lib/tracking";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { TrackingNumber } from "@shared/schema";
import CreateTrackingModal from "./create-tracking-modal";
import EditTrackingModal from "./edit-tracking-modal";

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTrackingId, setEditingTrackingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch tracking statistics
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  // Fetch all tracking numbers
  const { data: trackings = [], isLoading } = useQuery<TrackingNumber[]>({
    queryKey: ["/api/admin/tracking"],
  });

  // Filter trackings
  const filteredTrackings = trackings.filter(tracking => {
    const matchesSearch = tracking.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tracking.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tracking.currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/tracking/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tracking number deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tracking"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete tracking number",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (trackingId: string) => {
    setEditingTrackingId(trackingId);
    setShowEditModal(true);
  };

  const handleDelete = (trackingId: string) => {
    if (confirm("Are you sure you want to delete this tracking number? This action cannot be undone.")) {
      deleteMutation.mutate(trackingId);
    }
  };

  const handleView = (trackingNumber: string) => {
    window.open(`/?track=${trackingNumber}`, '_blank');
  };

  const statCards = [
    {
      icon: Package,
      title: "Total Packages",
      value: stats?.totalPackages || 0,
      color: "bg-brand-light-green text-brand-green"
    },
    {
      icon: Truck,
      title: "In Transit",
      value: stats?.inTransit || 0,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: CheckCircle,
      title: "Delivered",
      value: stats?.delivered || 0,
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Plus,
      title: "This Month",
      value: stats?.thisMonth || 0,
      color: "bg-blue-100 text-blue-600"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600 mt-1">Manage tracking numbers and status updates</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-brand-green hover:bg-brand-dark-green"
        >
          <Plus className="mr-2" size={16} />
          Create New Tracking
        </Button>
        <Button variant="outline">
          <Download className="mr-2" size={16} />
          Export Data
        </Button>
        <Button variant="outline">
          <Settings className="mr-2" size={16} />
          Settings
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Tracking Number
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="MTK123456789 or customer name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Filter
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Package Received">Package Received</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                className="w-full bg-brand-green hover:bg-brand-dark-green"
                onClick={() => {/* Implement search */}}
              >
                <Search className="mr-2" size={16} />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Table */}
      <Card>
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            All Tracking Numbers ({filteredTrackings.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Loading tracking numbers...
                  </td>
                </tr>
              ) : filteredTrackings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No tracking numbers found
                  </td>
                </tr>
              ) : (
                filteredTrackings.map((tracking) => (
                  <tr key={tracking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-medium text-gray-900">
                        {tracking.trackingNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(tracking.currentStatus)}>
                        {tracking.currentStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tracking.currentLocation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tracking.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tracking.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-brand-green hover:text-brand-dark-green"
                          onClick={() => handleEdit(tracking.id)}
                          title="Edit tracking"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleView(tracking.trackingNumber)}
                          title="View tracking page"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(tracking.id)}
                          disabled={deleteMutation.isPending}
                          title="Delete tracking"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <CreateTrackingModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      <EditTrackingModal 
        open={showEditModal}
        onOpenChange={setShowEditModal}
        trackingId={editingTrackingId}
      />
    </div>
  );
}
