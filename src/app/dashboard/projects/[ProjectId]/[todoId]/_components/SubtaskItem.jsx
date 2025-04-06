// components/SubtaskItem.jsx
"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import {
  ArrowRight,
  CalendarIcon,
  CheckIcon,
  CircleDotDashedIcon,
  FlagIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../../../components/ui/dropdown-menu"
import AlertBox from "../../../../../_components/AlertBox"

const SubtaskItem = ({ subtask, onUpdate, onDelete, projectId, todoId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(subtask.title);
  const [editedDescription, setEditedDescription] = useState(
    subtask.description || ""
  );
  const router = useRouter();
  // Updated priority colors for better visibility on dark backgrounds
  const priorityColors = {
    high: "border-red-500",
    medium: "border-yellow-500",
    low: "border-blue-500",
  };
  const prioritytextColors = {
    high: "text-red-500",
    medium: "text-yellow-500",
    low: "text-blue-500",
  };

  const statusColors = {
    "to-do": "bg-gray-500",
    "in-progress": "bg-purple-500",
    completed: "bg-green-500",
    blocked: "bg-red-600",
  };

  const handleStatusChange = (newStatus) => {
    onUpdate(subtask._id, { status: newStatus });
  };

  const handlePriorityChange = (newPriority) => {
    onUpdate(subtask._id, { priority: newPriority });
  };

  const handleSaveEdit = () => {
    onUpdate(subtask._id, {
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    const newStatus = subtask.status === "completed" ? "to-do" : "completed";
    onUpdate(subtask._id, {
      status: newStatus,
      completedAt: newStatus === "completed" ? new Date() : null,
    });
  };

  const formatDueDate = (date) => {
    if (!date) return null;
    return format(new Date(date), "MMM d, yyyy");
  };

  return (
    <div
      className={`bg-gray-700 rounded-lg p-4 border-l-4 ${
        subtask.status === "completed"
          ? "border-green-500 opacity-70"
          : priorityColors[subtask.priority]
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:border-indigo-500 h-20"
            placeholder="Description "
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start gap-3">
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

            <div className="flex-grow">
              <h3
                className={`font-medium ${
                  subtask.status === "completed"
                    ? "line-through text-gray-400"
                    : "text-white"
                }`}
              >
                {subtask.title}
              </h3>

              {subtask.description && (
                <p className="text-gray-300 text-sm mt-1">
                  {subtask.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-300">
                {subtask.dueDate && (
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{formatDueDate(subtask.dueDate)}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <FlagIcon
                    className={`w-4 h-4 ${
                      prioritytextColors[subtask.priority]
                    }`}
                  />
                  <span className="capitalize">{subtask.priority}</span>
                </div>

                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-white ${
                    statusColors[subtask.status]
                  }`}
                >
                  <span className="capitalize">
                    {subtask.status.replace("-", " ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger className="p-1 rounded-full hover:bg-gray-700">
                  <CircleDotDashedIcon className="w-5 h-5 text-gray-300" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-800 text-white">
                  <DropdownMenuLabel
                    onClick={() => {
                      setIsEditing(true);
                    }}
                    className="flex items-center justify-start gap-3 cursor-pointer hover:bg-gray-700"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  {["to-do", "in-progress", "completed", "blocked"].map(
                    (status) => (
                      <DropdownMenuLabel
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${statusColors[status]}`}
                        ></div>
                        <span className="capitalize">
                          {status.replace("-", " ")}
                        </span>
                      </DropdownMenuLabel>
                    )
                  )}
                  <DropdownMenuSeparator />

                  <DropdownMenuLabel>Priority</DropdownMenuLabel>
                  {["high", "medium", "low"].map((priority) => (
                    <DropdownMenuLabel
                      key={priority}
                      onClick={() => handlePriorityChange(priority)}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          priority === "high"
                            ? "bg-red-500"
                            : priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                      ></div>
                      <span className="capitalize">{priority}</span>
                    </DropdownMenuLabel>
                  ))}
                  <DropdownMenuSeparator />

                  <DropdownMenuLabel
                    onClick={() => {
                      router.push(
                        `/dashboard/projects/${projectId}/${todoId}/${subtask._id}`
                      );
                    }}
                    className="flex items-center justify-start gap-3 cursor-pointer hover:bg-gray-700"
                  >
                    {" "}
                    <ArrowRight className="w-5 h-5" />
                    Go to
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel
                    className="flex items-center justify-start gap-3 cursor-pointer hover:bg-gray-700"
                  >
                    <AlertBox onConfirm={()=>{onDelete(subtask._id)}}>
                      <div className=" flex items-center gap-2">
                        {" "}
                        <TrashIcon className="w-4 h-4" />
                        Delete
                      </div>
                    </AlertBox>
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubtaskItem;
