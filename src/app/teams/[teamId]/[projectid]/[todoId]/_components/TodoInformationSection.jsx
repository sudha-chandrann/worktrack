import { formatDate } from "date-fns";
import React from "react";
import { User, Crown, Folder, Clock, CheckSquare } from "lucide-react";

const TodoInformationSection = ({ todo, userId }) => {
  const formatDueDate = (date) => {
    if (!date) return null;
    return formatDate(new Date(date), "MMM d, yyyy");
  };


  return (
    <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
      <h3 className="text-gray-200 font-medium mb-4 border-b border-gray-700 pb-2">
        Task Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
        { (
          <div className="flex items-center gap-2">
            <div className="bg-blue-900/30 p-2 rounded-md">
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 block">
                Assigned to
              </span>
              <span className="text-gray-200">
                {todo.assignedTo._id===userId  ? "me" : todo.assignedTo.fullName}
              </span>
            </div>
          </div>
        )}

        {todo.assignedBy && (
          <div className="flex items-center gap-2">
            <div className="bg-purple-900/30 p-2 rounded-md">
              <Crown className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 block">
                Assigned by
              </span>
              <span className="text-gray-200">
                {" "}
                {todo.assignedBy._id===userId ? "me" : todo.assignedBy.fullName}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="bg-indigo-900/30 p-2 rounded-md">
            <Folder className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-400 block">
              Project
            </span>
            <span className="flex items-center gap-2 text-gray-200">
              {todo.project?.icon ? (
                <span style={{ color: todo.project?.color || "#3498db" }}>
                  {todo.project.icon}
                </span>
              ) : (
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: todo.project?.color || "#3498db" }}
                ></div>
              )}
              {todo.project?.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-green-900/30 p-2 rounded-md">
            <Clock className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-400 block">
              Created
            </span>
            <span className="text-gray-200">
              {formatDueDate(todo.createdAt)}
            </span>
          </div>
        </div>

        {todo.status === "completed" && (
          <div className="flex items-center gap-2">
            <div className="bg-teal-900/30 p-2 rounded-md">
              <CheckSquare className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 block">
                Completed
              </span>
              <span className="text-gray-200">
                {formatDueDate(todo.completedAt)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoInformationSection;
