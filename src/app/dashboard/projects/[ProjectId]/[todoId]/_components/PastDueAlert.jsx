// components/alerts/PastDueAlert.jsx
import React from "react";

const PastDueAlert = () => {
  return (
    <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4 flex items-center">
      <span className="text-xl mr-2">⚠️</span>
      <span>This task is past due! The due date has already passed.</span>
    </div>
  );
};

export default PastDueAlert;