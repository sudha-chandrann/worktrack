// components/status/StatusBadge.jsx
import React from "react";

const StatusBadge = ({ status }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "to-do":
        return "📋";
      case "in-progress":
        return "⏳";
      case "completed":
        return "✅";
      case "blocked":
        return "🚫";
      default:
        return "📋";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "to-do":
        return "bg-gray-700 text-gray-200";
      case "in-progress":
        return "bg-blue-700 text-blue-200";
      case "completed":
        return "bg-green-700 text-green-200";
      case "blocked":
        return "bg-red-700 text-red-200";
      default:
        return "bg-gray-700 text-gray-200";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusColor(
        status
      )}`}
    >
      {getStatusIcon(status)} {status}
    </span>
  );
};

export default StatusBadge;