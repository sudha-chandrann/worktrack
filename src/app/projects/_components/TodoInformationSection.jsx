// components/sections/TodoInformationSection.jsx
import { formatDate } from "date-fns";
import React from "react";

const TodoInformationSection = ({ todo }) => {
    const formatDueDate = (date) => {
      if (!date) return null;
      return formatDate(new Date(date), "MMM d, yyyy");
    };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      {todo.assignedTo && (
        <div className="flex items-center gap-1">
          <span className="font-medium text-gray-400">
            👤 Assigned to:{" "}
          </span>
          <span>{todo.assignedTo.fullName}</span>
        </div>
      )}

      {todo.assignedBy && (
        <div className="flex items-center gap-1">
          <span className="font-medium text-gray-400">
            👑 Assigned by:{" "}
          </span>
          <span>{todo.assignedBy.fullName}</span>
        </div>
      )}

      <div className="flex items-center gap-1">
        <span className="font-medium text-gray-400">📁 Project: </span>
        <span className="flex items-center gap-1">
          <span style={{ color: todo.project?.color || "#3498db" }}>
            {todo.project?.icon || "📝"}
          </span>
          {todo.project?.name}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <span className="font-medium text-gray-400">🕒 Created: </span>
        <span>{formatDueDate(todo.createdAt)}</span>
      </div>

      {todo.completedAt && (
        <div className="flex items-center gap-1">
          <span className="font-medium text-gray-400">
            ✅ Completed:{" "}
          </span>
          <span>{formatDueDate(todo.completedAt)}</span>
        </div>
      )}
    </div>
  );
};

export default TodoInformationSection;