import React from "react";
import { Flag } from "lucide-react";

const PriorityTag = ({ priority }) => {
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "high":
        return {
          icon: <Flag className="w-4 h-4 mr-1.5 text-red-400" />,
          className: "text-red-400 bg-red-900/30 border-red-700/40"
        };
      case "medium":
        return {
          icon: <Flag className="w-4 h-4 mr-1.5 text-yellow-400" />,
          className: "text-yellow-400 bg-yellow-900/30 border-yellow-700/40"
        };
      case "low":
        return {
          icon: <Flag className="w-4 h-4 mr-1.5 text-green-400" />,
          className: "text-green-400 bg-green-900/30 border-green-700/40"
        };
      default:
        return {
          icon: <Flag className="w-4 h-4 mr-1.5 text-yellow-400" />,
          className: "text-yellow-400 bg-yellow-900/30 border-yellow-700/40"
        };
    }
  };

  const { icon, className } = getPriorityConfig(priority);

  return (
    <div className={`px-3 py-1.5 rounded-md text-sm flex items-center border ${className}`}>
      {icon}
      <span className="capitalize">{priority} priority</span>
    </div>
  );
};

export default PriorityTag;