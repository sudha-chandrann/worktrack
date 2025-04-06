"use client";
import React, { useEffect, useState } from "react";
import { formatDate } from "date-fns";
import { CheckIcon, Pen, Trash2 } from "lucide-react";
import PastDueAlert from "../../_components/PastDueAlert";
import AlertBox from "../../../../../../_components/AlertBox"
import StatusBadge from "../../_components/StatusBadge";
import PriorityTag from "../../_components/PriorityTag";
import DueDate from "../../_components/DueDate";

function SubTaskDetailView({ subtask, onUpdate, onDelete }) {
  const [isPastDue, setIsPastDue] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setMinDate(today.toISOString().split("T")[0]);

    if (subtask.dueDate) {
      const dueDate = new Date(subtask.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      setIsPastDue(dueDate < today && subtask.status !== "completed");
    }
  }, [subtask.dueDate, subtask.status]);



  const handleToggleComplete = () => {
    const newStatus = subtask.status === "completed" ? "to-do" : "completed";
    onUpdate({
      status: newStatus,
      completedAt: newStatus === "completed" ? new Date() : null,
    });
  };

  const formatDueDate = (date) => {
    if (!date) return null;
    return formatDate(new Date(date), "MMM d, yyyy");
  };

  return (
    <div className="bg-gray-800 text-gray-100 rounded-lg shadow-md p-6">
      {isPastDue && <PastDueAlert />}
      {!isEditing ? (
        <>
          <div className="flex justify-between items-start mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleComplete}
                className={`flex-shrink-0 w-5 h-5 mt-1 rounded-full border ${
                  subtask.status === "completed"
                    ? "bg-green-500 border-green-600"
                    : "bg-transparent border-gray-400"
                }`}
              >
                {subtask.status === "completed" && (
                  <CheckIcon className="w-4 h-4 text-white" />
                )}
              </button>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                {subtask.title}
              </h2>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 border border-gray-600"
              >
                <Pen className="w-4 h-4" />
                Edit
              </button>
              <AlertBox onConfirm={onDelete}>
                <button className="px-4 py-2 bg-red-900/70 hover:bg-red-800 text-red-100 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 border border-red-800/50">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </AlertBox>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4 w-full md:gap-4 flex-wrap">
            <StatusBadge status={subtask.status} />
            <PriorityTag priority={subtask.priority} />
            {subtask.dueDate && (
              <DueDate
                date={subtask.dueDate}
                isPastDue={isPastDue}
                formatDueDate={formatDueDate}
              />
            )}
          </div>

          <div className="mb-6 text-gray-300">
            {subtask.description ? (
              <div className="flex flex-wrap gap-2">
                <span className="font-medium text-gray-400">Description: </span>
                <p className="whitespace-pre-line">{subtask.description}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">No description provided</p>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default SubTaskDetailView;
