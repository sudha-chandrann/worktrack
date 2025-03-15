// components/priority/PriorityTag.jsx
import React from "react";

const PriorityTag = ({ priority }) => {
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "🟡";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-yellow-400";
    }
  };

  return (
    <span
      className={`font-medium ${getPriorityColor(
        priority
      )} flex items-center gap-1`}
    >
      {getPriorityIcon(priority)} {priority} priority
    </span>
  );
};

export default PriorityTag;