"use client";
import { formatDate } from "date-fns";
import React, { useEffect, useState } from "react";
import { Clock, Calendar, User, CheckSquare, FileText, ArrowUp } from "lucide-react";
import StatusBadge from "../../_components/StatusBadge";
import PriorityTag from "../../_components/PriorityTag";
import DueDate from "../../_components/DueDate";

const SubtaskInformationSection = ({ subtask }) => {
  const formatDueDate = (date) => {
    if (!date) return null;
    return formatDate(new Date(date), "MMM d, yyyy");
  };
  
  const [isPastDue, setIsPastDue] = useState(false);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);    
    if (subtask.parentTask.dueDate) {
      const dueDate = new Date(subtask.parentTask.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      setIsPastDue(dueDate < today && subtask.parentTask.status !== "completed");
    }
  }, [subtask.parentTask.dueDate, subtask.parentTask.status]);

  return (
    <div className="space-y-6">
      {/* Time Information Card */}
      <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
        <h3 className="text-gray-300 font-medium mb-3 flex items-center">
          <Clock className="w-4 h-4 mr-2" /> Time Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-400">Created:</span>
            <span>{formatDueDate(subtask.createdAt)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-400">Updated:</span>
            <span>{formatDueDate(subtask.updatedAt)}</span>
          </div>

          {subtask.status === "completed" && (
            <div className="flex items-center gap-2 text-gray-300">
              <CheckSquare className="w-4 h-4 text-green-500" />
              <span className="font-medium text-gray-400">Completed:</span>
              <span>{formatDueDate(subtask.completedAt)}</span>
            </div>
          )}
          
          {subtask.assignedTo && (
            <div className="flex items-center gap-2 text-gray-300">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-400">Assigned to:</span>
              <span>{subtask.assignedTo.fullName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Parent Task Information Card */}
      {subtask.parentTask && (
        <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
          <h3 className="text-gray-300 font-medium mb-3 flex items-center">
            <FileText className="w-4 h-4 mr-2" /> Parent Task Information
          </h3>
          
          <div className="mb-3">
            <div className="flex items-start gap-2 mb-3">
              <ArrowUp className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-400 block mb-1">Parent Task:</span>
                <p className="text-gray-200 font-medium">{subtask.parentTask.title}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-2">
            <StatusBadge status={subtask.parentTask.status} />
            <PriorityTag priority={subtask.parentTask.priority} />
            {subtask.parentTask.dueDate && (
              <DueDate
                date={subtask.parentTask.dueDate} 
                isPastDue={isPastDue} 
                formatDueDate={formatDueDate} 
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubtaskInformationSection;