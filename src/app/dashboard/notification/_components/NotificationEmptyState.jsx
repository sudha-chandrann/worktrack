import React from "react";
import { BellOffIcon } from "lucide-react";

const NotificationEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <BellOffIcon className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
      <p className="text-sm text-gray-500 max-w-sm text-center mt-2">
        You&apos;re all caught up! When you receive new notifications, they will appear here.
      </p>
    </div>
  );
};

export default NotificationEmptyState;