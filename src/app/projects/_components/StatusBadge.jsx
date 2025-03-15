import React from "react";
import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "to-do":
        return {
          icon: <AlertCircle className="w-4 h-4 mr-1.5" />,
          className: "bg-gray-700 text-gray-200 border-gray-600"
        };
      case "in-progress":
        return {
          icon: <Clock className="w-4 h-4 mr-1.5" />,
          className: "bg-blue-900/40 text-blue-200 border-blue-700/50"
        };
      case "completed":
        return {
          icon: <CheckCircle className="w-4 h-4 mr-1.5" />,
          className: "bg-green-900/40 text-green-200 border-green-700/50"
        };
      case "blocked":
        return {
          icon: <XCircle className="w-4 h-4 mr-1.5" />,
          className: "bg-red-900/40 text-red-200 border-red-700/50"
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4 mr-1.5" />,
          className: "bg-gray-700 text-gray-200 border-gray-600"
        };
    }
  };

  const { icon, className } = getStatusConfig(status);

  return (
    <div className={`px-3 py-1.5 rounded-md text-sm flex items-center border ${className}`}>
      {icon}
      <span className="capitalize">{status}</span>
    </div>
  );
};

export default StatusBadge;