import React from "react";
import { Calendar, AlertTriangle } from "lucide-react";

const DueDate = ({ date, isPastDue, formatDueDate }) => {
  return (
    <div className={`
      px-3 py-1.5 rounded-md text-sm flex items-center border
      ${isPastDue 
        ? 'text-red-300 bg-red-900/30 border-red-700/40' 
        : 'text-gray-300 bg-gray-800 border-gray-700'}
    `}>
      {isPastDue 
        ? <AlertTriangle className="w-4 h-4 mr-1.5 text-red-400" /> 
        : <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />}
      <span>Due: {formatDueDate(date)}</span>
    </div>
  );
};

export default DueDate;