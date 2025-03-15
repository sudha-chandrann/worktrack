// components/common/DueDate.jsx
import React from "react";

const DueDate = ({ date, isPastDue, formatDueDate }) => {
  return (
    <span className={`text-gray-300 flex items-center gap-1 ${isPastDue ? 'text-red-400' : ''}`}>
      {isPastDue ? '⚠️' : '📅'} Due: {formatDueDate(date)}
    </span>
  );
};

export default DueDate;


