import React, { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Search,
  Eye,
  Edit2,
  Copy,
  Trash2,
  Mail,
  Clock,
  CheckCircle,
  BarChart3,
  RefreshCw,
  X,
  Users2,
  Gift,
  Settings,
  Package,
  Download // ✨ Added Download icon import
} from "lucide-react";
import { CreateNotificationModal } from "../components/modals/CreateNotificationModal";
import { EditNotificationModal } from "../components/modals/EditNotificationModal";
import { DeleteConfirmationModal } from "../components/modals/DeleteConfirmationModal";
import { showSuccessToast } from "../lib/toast";
import { toast } from "sonner";
import { useApiNotificationStats } from "../lib/hooks/useApiNotificationStats";
import { useApiNotifications } from "../lib/hooks/useApiNotifications";

export function PushNotifications() {
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // ✨ --- API Hook for List --- ✨
  const {
    notifications: filteredNotifications,
    loading: listLoading,
    error: listError,
    total,
    refetch,
    createNotification,
    updateNotification,
    deleteNotification,
  } = useApiNotifications({
    search: searchQuery,
    audience: audienceFilter,
    type: typeFilter,
    status: statusFilter,
    time: timeFilter,
  });

  // ✨ --- API Hook for Stats --- ✨
  const { 
    stats, 
    loading: statsLoading 
  } = useApiNotificationStats();

  // ✨ UPDATED: Refresh Handler with Toast
  const handleRefresh = () => {
    if (refetch) refetch();
    toast.success("Notifications refreshed");
  };

  const handleExport = () => {
    toast.info("Exporting notifications...");
  };

  const handleView = (id) => {
    console.log("Viewing notification:", id);
    toast.info("View functionality to be implemented.");
  };

  const handleEdit = (id) => {
    const notification = filteredNotifications.find((n) => n.id === id);
    if (notification) {
      setSelectedNotification(notification);
      setEditModalOpen(true);
    }
  };

  const handleSaveEdit = async (updatedData) => {
    if (selectedNotification) {
      try {
        await updateNotification(selectedNotification.id, updatedData);
        setEditModalOpen(false);
        setSelectedNotification(null);
        showSuccessToast("Notification updated successfully!");
        refetch(); // Ensure list updates
      } catch (err) {
        toast.error(err.message || "Failed to update notification");
      }
    }
  };
  
  const handleCreate = async (notification) => {
    try {
      const formattedData = {
        id: notification.id,
        title: notification.title,
        description: notification.message,
        audience:
          notification.targetAudience === "all"
            ? "All Users"
            : notification.targetAudience === "branches"
              ? "Specific Branches"
              : notification.targetAudience === "role"
                ? "By Role"
                : "Specific Customers",
        type:
          notification.type === "promotional"
            ? "Promo"
            : notification.type === "system"
              ? "System"
              : notification.type === "order"
                ? "Order"
                : "Alert",
        status: notification.status,
        // ... (rest of logic remains same)
      };
    
      await createNotification(formattedData);
      setCreateModalOpen(false);
      showSuccessToast(
        `Notification ${notification.status === "sent" ? "sent" : notification.status === "scheduled" ? "scheduled" : "saved as draft"} successfully!`,
      );
      refetch(); // Ensure list updates
    } catch (err) {
      toast.error(err.message || "Failed to create notification");
    }
  };

  const handleDuplicate = (id) => {
    const notification = filteredNotifications.find((n) => n.id === id);
    if (notification) {
      const duplicated = {
        ...notification,
        id: Date.now().toString(),
        title: `${notification.title} (Copy)`,
        status: "draft",
        delivered: 0,
        opened: 0,
        clickRate: "0.0%",
        date: "N/A",
        time: "",
      };
      handleCreate(duplicated);
      showSuccessToast("Notification duplicated successfully!");
    }
  };

  const handleDelete = (id) => {
    const notification = filteredNotifications.find((n) => n.id === id);
    if (notification) {
      setSelectedNotification(notification);
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedNotification) {
      try {
        await deleteNotification(selectedNotification.id);
        setDeleteModalOpen(false);
        setSelectedNotification(null);
        showSuccessToast("Notification deleted successfully!");
        refetch(); // Ensure list updates
      } catch (err) {
        toast.error(err.message || "Failed to delete notification");
      }
    }
  };

  return (
    <div className="p-4">
      {/* Header Controls */}
      <div className="mb-4 flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Push Notifications</h2>
            <p className="text-muted-foreground">Manage app notifications and campaigns</p>
        </div>
        <div className="flex gap-2">
           {/* ✨ UPDATED: Refresh Button (Text + Icon style) */}
           <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="transition-all duration-200 h-9 text-xs border border-gray-300 gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          
          {/* Added Export button for consistency if needed, otherwise removed */}
          <Button 
            size="sm"
            onClick={handleExport}
            className="transition-all duration-200 h-9 text-xs bg-red-500 hover:bg-red-600 text-white border border-red-500 gap-2"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>

          <Button
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="h-9 text-xs bg-red-500 hover:bg-red-600 text-white border border-red-500 gap-2"
          >
            + Create Notification
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">
                Total Sent
              </p>
              <h3 className="text-lg">{statsLoading ? '...' : stats.totalSent}</h3>
            </div>
            <div className="h-9 w-9 bg-red-50 rounded-full flex items-center justify-center text-red-500">
              <Mail className="h-4 w-4" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">
                Scheduled
              </p>
              <h3 className="text-lg">{statsLoading ? '...' : stats.scheduled}</h3>
            </div>
            <div className="h-9 w-9 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
              <Clock className="h-4 w-4" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">
                Drafts
              </p>
              <h3 className="text-lg">{statsLoading ? '...' : stats.drafts}</h3>
            </div>
            <div className="h-9 w-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
              <Edit2 className="h-4 w-4" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">
                Avg Click Rate
              </p>
              <h3 className="text-lg">{statsLoading ? '...' : stats.avgClickRate}</h3>
            </div>
            <div className="h-9 w-9 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b space-y-3">
          {/* Search and Filters Row */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                className="pl-9 text-xs h-9 transition-all duration-200 border border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select
              value={audienceFilter}
              onValueChange={setAudienceFilter}
            >
              <SelectTrigger className="h-9 text-xs w-[140px] border border-gray-300">
                <SelectValue placeholder="All Audiences" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">
                  All Audiences
                </SelectItem>
                <SelectItem
                  value="All Users"
                  className="text-xs"
                >
                  All Users
                </SelectItem>
                <SelectItem
                  value="Downtown Branch"
                  className="text-xs"
                >
                  Downtown Branch
                </SelectItem>
                <SelectItem
                  value="Specific Customers"
                  className="text-xs"
                >
                  Specific Customers
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
              <SelectTrigger className="h-9 text-xs w-[120px] border border-gray-300">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">
                  All Types
                </SelectItem>
                <SelectItem value="Promo" className="text-xs">
                  Promo
                </SelectItem>
                <SelectItem value="System" className="text-xs">
                  System
                </SelectItem>
                <SelectItem value="Order" className="text-xs">
                  Order
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="h-9 text-xs w-[120px] border border-gray-300">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">
                  All Status
                </SelectItem>
                <SelectItem value="sent" className="text-xs">
                  Sent
                </SelectItem>
                <SelectItem
                  value="scheduled"
                  className="text-xs"
                >
                  Scheduled
                </SelectItem>
                <SelectItem value="draft" className="text-xs">
                  Draft
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={timeFilter}
              onValueChange={setTimeFilter}
            >
              <SelectTrigger className="h-9 text-xs w-[120px] border border-gray-300">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">
                  All Time
                </SelectItem>
                <SelectItem value="today" className="text-xs">
                  Today
                </SelectItem>
                <SelectItem value="week" className="text-xs">
                  This Week
                </SelectItem>
                <SelectItem value="month" className="text-xs">
                  This Month
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* List Content */}
        {listLoading && <div className="p-8 text-center text-sm text-gray-500">Loading notifications...</div>}
        {listError && <div className="p-8 text-center text-red-500 text-sm">Error: {listError}</div>}
        
        {!listLoading && !listError && (
          <>
            <Table>
              <TableHeader>
                <TableRow className="text-xs bg-gray-50/50">
                  <TableHead className="w-12">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableHead>
                  <TableHead>TITLE</TableHead>
                  <TableHead>AUDIENCE</TableHead>
                  <TableHead>TYPE</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>ANALYTICS</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead className="text-right">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow
                    key={notification.id}
                    className="hover:bg-gray-50 transition-colors duration-200 text-xs group"
                  >
                    <TableCell>
                      <input type="checkbox" className="rounded border-gray-300" />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium flex items-center gap-2 text-gray-900">
                          {notification.status === "sent" && (
                            <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                          )}
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                          {notification.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-600 flex items-center gap-1.5">
                        <Users2 className="h-3.5 w-3.5 text-gray-400" />{" "}
                        {notification.audience}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          notification.type === "Promo"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : notification.type === "System"
                              ? "bg-gray-50 text-gray-700 border-gray-100"
                              : "bg-purple-50 text-purple-700 border-purple-100"
                        }`}
                      >
                        {notification.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          notification.status === "sent"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : notification.status === "scheduled"
                              ? "bg-orange-50 text-orange-700 border-orange-100"
                              : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {notification.status === "sent" && <CheckCircle className="h-3 w-3" />}
                        {notification.status === "scheduled" && <Clock className="h-3 w-3" />}
                        {notification.status
                          .charAt(0)
                          .toUpperCase() +
                          notification.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-[10px] text-gray-500">
                        <div className="flex items-center justify-between gap-2">
                          <span>Delivered:</span>
                          <span className="font-medium text-gray-900">
                            {notification.delivered?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span>Click Rate:</span>
                          <span className="font-medium text-gray-900">
                            {notification.clickRate || "0%"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-500">
                        {notification.date !== "N/A" ? (
                          <>
                            <p>{notification.date}</p>
                            <p className="text-[10px] text-gray-400">
                              {notification.time}
                            </p>
                          </>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                          onClick={() => handleView(notification.id)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-blue-50 text-gray-500 hover:text-blue-600"
                          onClick={() => handleEdit(notification.id)}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-red-50 text-gray-500 hover:text-red-600"
                          onClick={() => handleDelete(notification.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            <div className="p-4 border-t flex items-center justify-between bg-gray-50/50">
              <div className="text-xs text-muted-foreground">
                Showing {filteredNotifications.length} of {total} results
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border border-gray-300 bg-white"
                  disabled
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border border-gray-300 bg-white hover:bg-gray-50"
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <CreateNotificationModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSend={handleCreate} 
      />

      {selectedNotification && (
        <>
          <EditNotificationModal
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            onSave={handleSaveEdit} 
            notification={selectedNotification}
          />

          <DeleteConfirmationModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            onConfirm={handleConfirmDelete} 
            title="Delete Notification"
            description={`Are you sure you want to delete "${selectedNotification.title}"? This action cannot be undone.`}
          />
        </>
      )}
    </div>
  );
}