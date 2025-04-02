import React from "react";
import { formatDistanceToNow } from "date-fns";
import { BellIcon, MessageSquareIcon, AlertTriangleIcon, RefreshCwIcon, CheckIcon, TrashIcon, CircleIcon } from "lucide-react";

const NotificationItem = ({ notification, onRead, onDelete }) => {
  const notificationTypes = {
    invitation: {
      icon: <BellIcon className="h-5 w-5 text-blue-500" />,
      className: "border-l-blue-500",
    },
    message: {
      icon: <MessageSquareIcon className="h-5 w-5 text-green-500" />,
      className: "border-l-green-500",
    },
    alert: {
      icon: <AlertTriangleIcon className="h-5 w-5 text-red-500" />,
      className: "border-l-red-500",
    },
    update: {
      icon: <RefreshCwIcon className="h-5 w-5 text-purple-500" />,
      className: "border-l-purple-500",
    },
  };

  const { icon, className } = notificationTypes[notification.type] || notificationTypes.alert;

  const handleClick = () => {
    if (!notification.isRead) {
      onRead(notification._id);
    }
  };

  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div 
      className={`flex items-start p-4 mb-2 bg-white border-l-4 rounded-md shadow-sm hover:shadow-md transition-shadow ${className} ${
        notification.isRead ? "opacity-70" : ""
      }`}
    >
      <div className="flex-shrink-0 mr-1">
        <div 
          className="w-6 h-6 flex items-center justify-center cursor-pointer"
          onClick={ handleClick }
          title={notification.isRead ? "Marked as read" : "Mark as read"}
        >
          {notification.isRead ? (
            <div className="w-4 h-4 rounded-full border-2 border-green-800 flex items-center justify-center bg-green-800">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 mr-3 mt-1">
        {icon}
      </div>
      
      <div className="flex-grow" >
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium text-gray-800">
            {notification.type?.charAt(0).toUpperCase() + notification.type?.slice(1) || "System"}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(notification.createdAt)}
          </span>
        </div>
        
        <div className="text-sm text-gray-700 mb-1">
          {notification.message}
        </div>
        
        {notification.sender && (
          <div className="text-xs text-gray-500">
            Sent by {notification.sender.fullName}
          </div>
        )}
      </div>
      
      <div className="flex flex-shrink-0 ml-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification._id);
          }}
          className="p-1 rounded-full hover:bg-red-100 text-red-600"
          title="Delete"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;