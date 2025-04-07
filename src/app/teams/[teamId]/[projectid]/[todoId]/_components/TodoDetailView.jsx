// components/TodoDetailView.jsx
"use client";
import React, { useState, useEffect } from "react";
import { formatDate } from "date-fns";
import { CheckIcon, Pen, Trash2 } from "lucide-react";
import PastDueAlert from  "../../../../../dashboard/projects/[ProjectId]/[todoId]/_components/PastDueAlert"
import AlertBox from "../../../../../_components/AlertBox"
import StatusBadge from "../../../../../dashboard/projects/[ProjectId]/[todoId]/_components/StatusBadge";
import PriorityTag from "../../../../../dashboard/projects/[ProjectId]/[todoId]/_components/PriorityTag";
import DueDate from "../../../../../dashboard/projects/[ProjectId]/[todoId]/_components/DueDate"
import TagsList from "../../../../../dashboard/projects/[ProjectId]/[todoId]/_components/TagsList"


const TodoDetailView = ({
  todo,
  onUpdate,
  onDelete,
  isAdmin,
  teammembers,
  userId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPastDue, setIsPastDue] = useState(false);
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setMinDate(today.toISOString().split("T")[0]);

    if (todo.dueDate) {
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      setIsPastDue(dueDate < today && todo.status !== "completed");
    }
  }, [todo.dueDate, todo.status]);

  const handleSaveEdit = (formData) => {
    onUpdate(formData);
    setIsEditing(false);
  };
  const handleToggleComplete = () => {
    const newStatus = todo.status === "completed" ? "to-do" : "completed";
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
          <div className="flex justify-between items-start mb-4 flex-wrap-reverse">
            <div className="flex items-center gap-2">
              {todo.assignedTo._id === userId && (
                <button
                  onClick={handleToggleComplete}
                  className={`flex-shrink-0 w-5 h-5 mt-1 rounded-full border ${
                    todo.status === "completed"
                      ? "bg-green-500 border-green-600"
                      : "bg-transparent border-gray-400"
                  }`}
                >
                  {todo.status === "completed" && (
                    <CheckIcon className="w-4 h-4 text-white" />
                  )}
                </button>
              )}
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                {todo.title}
              </h2>
            </div>

            {isAdmin && (
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
            )}
          </div>

          <div className="flex items-center gap-2 mb-4 w-full md:gap-4 flex-wrap">
            <StatusBadge status={todo.status} />
            <PriorityTag priority={todo.priority} />
            {todo.dueDate && (
              <DueDate
                date={todo.dueDate}
                isPastDue={isPastDue}
                formatDueDate={formatDueDate}
              />
            )}
          </div>

          <div className="mb-6 text-gray-300">
            {todo.description ? (
              <div className="flex flex-wrap gap-2">
                <span className="font-medium text-gray-400">Description: </span>
                <p className="whitespace-pre-line">{todo.description}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">No description provided</p>
            )}
          </div>


          {todo.tags && todo.tags.length > 0 && <TagsList tags={todo.tags} />}
        </>
      ) : (
      <></>
      )}
    </div>
  );
};

export default TodoDetailView;
