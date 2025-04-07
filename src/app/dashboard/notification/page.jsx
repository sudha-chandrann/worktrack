"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { BellIcon, Loader2Icon } from "lucide-react";
import axios from "axios";
import NotificationItem from "./_components/NotificationItem";
import NotificationEmptyState from "./_components/NotificationEmptyState";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getnotifcation = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/notifications");
      setNotifications(response.data.data);
    } catch (error) {
      setError(error.message || "something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getnotifcation();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await axios.patch(
        `/api/notifications/${notificationId}`
      );
      toast.success(response.message || "Notification marked as read");
      getnotifcation();
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const response=await axios.delete(`/api/notifications/${notificationId}`);
      toast.success(response.data.message||"Notification deleted");
      getnotifcation();
    } catch (error) {
      toast.error(error.response?.data?.message||"Failed to delete notification");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pt-[78px]">
      <div className="flex items-center mb-6">
        <BellIcon className="h-6 w-6 text-blue-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-200">Notifications</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2Icon className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      ) : notifications.length === 0 ? (
        <NotificationEmptyState />
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onRead={handleMarkAsRead}
              onDelete={handleDeleteNotification}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
