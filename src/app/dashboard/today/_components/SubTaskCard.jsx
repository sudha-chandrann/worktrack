"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import {
  ArrowRight,
  CalendarIcon,
  CheckIcon,
  CircleDotDashedIcon,
  File,
  FlagIcon,
  PencilIcon,
  TrashIcon,
  Users2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenuLabel,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import AlertBox from "../../../_components/AlertBox";

const SubTaskCard = ({ subtask, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(subtask.title);
  const [editedDescription, setEditedDescription] = useState(
    subtask.description || ""
  );
  const router = useRouter();
  // Enhanced styling with more vibrant yet professional colors
  const priorityColors = {
    high: "border-red-500",
    medium: "border-amber-500",
    low: "border-blue-500",
  };
  
  const priorityTextColors = {
    high: "text-red-400",
    medium: "text-amber-400",
    low: "text-blue-400",
  };

  const priorityBgColors = {
    high: "bg-red-500/20",
    medium: "bg-amber-500/20",
    low: "bg-blue-500/20",
  };

  const statusColors = {
    "to-do": "bg-gray-500",
    "in-progress": "bg-indigo-500",
    completed: "bg-emerald-500",
    blocked: "bg-red-500",
  };

  const statusBgColors = {
    "to-do": "bg-gray-500/20 text-gray-300",
    "in-progress": "bg-indigo-500/20 text-indigo-300",
    completed: "bg-emerald-500/20 text-emerald-300",
    blocked: "bg-red-500/20 text-red-300",
  };

  const handleStatusChange = (newStatus) => {
    onUpdate(subtask.parentTask.project,subtask.parentTask._id, subtask._id, { status: newStatus });
  };

  const handlePriorityChange = (newPriority) => {
    onUpdate(subtask.parentTask.project,subtask.parentTask._id, subtask._id, { priority: newPriority });
  };

  const handleSaveEdit = () => {
    onUpdate(subtask.parentTask.project,subtask.parentTask._id, subtask._id, {
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    const newStatus = subtask.status === "completed" ? "to-do" : "completed";
    onUpdate(subtask.parentTask.project,subtask.parentTask._id, subtask._id, {
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
      className={`bg-gray-800 rounded-lg p-5 border-l-4 shadow-lg transition-all duration-200 hover:shadow-xl ${
        subtask.status === "completed"
          ? "border-emerald-500 opacity-75"
          : priorityColors[subtask.priority]
      }`}
    >
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-24 text-base"
            placeholder="Description (optional)"
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start gap-4">
            <button
              onClick={handleToggleComplete}
              className={`flex-shrink-0 w-6 h-6 mt-1 rounded-full border-2 flex items-center justify-center ${
                subtask.status === "completed"
                  ? "bg-emerald-500 border-emerald-600"
                  : "bg-transparent border-gray-400 hover:border-indigo-400"
              } transition-colors duration-200`}
            >
              {subtask.status === "completed" && (
                <CheckIcon className="w-4 h-4 text-white" />
              )}
            </button>

            <div className="flex-grow">
              <h3
                className={`text-lg font-semibold ${
                  subtask.status === "completed"
                    ? "line-through text-gray-400"
                    : "text-white"
                }`}
              >
                {subtask.title}
              </h3>

              {subtask.description && (
                <p className="text-gray-300 mt-2 leading-relaxed">{subtask.description}</p>
              )}

              <div className="mt-4 space-y-3">
                {/* Todo details */}
                {subtask.parentTask.title && (
                  <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-700/50 px-3 py-2 rounded-md">
                    <File className="w-4 h-4 text-indigo-400" />
                    <span className="font-medium">
                       {subtask.parentTask.title}
                    </span>
                  </div>
                )}

                {/* Main metadata */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {/* Status badge */}
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                      statusBgColors[subtask.status]
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${statusColors[subtask.status]}`}></div>
                    <span className="capitalize font-medium">
                      {subtask.status.replace("-", " ")}
                    </span>
                  </div>
                  
                  {/* Priority badge */}
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                      priorityBgColors[subtask.priority]
                    }`}
                  >
                    <FlagIcon className={`w-4 h-4 ${priorityTextColors[subtask.priority]}`} />
                    <span className={`capitalize font-medium ${priorityTextColors[subtask.priority]}`}>
                      {subtask.priority}
                    </span>
                  </div>

                  {/* Due date */}
                  {subtask.dueDate && (
                    <div className="flex items-center gap-1.5 bg-gray-700/50 px-3 py-1.5 rounded-full">
                      <CalendarIcon className="w-4 h-4 text-gray-300" />
                      <span className="text-gray-300">{formatDueDate(subtask.dueDate)}</span>
                    </div>
                  )}
                </div>
                
                {/* People section */}
                {(subtask.assignedTo) && (
                  <div className="flex flex-wrap gap-3 mt-2">                    
                    {subtask.assignedTo && (
                      <div className="flex items-center gap-1.5 bg-gray-700/50 px-3 py-1.5 rounded-full text-sm">
                        <Users2Icon className="w-4 h-4 text-gray-300" />
                        <span className="text-gray-300">To: {subtask.assignedTo.fullName}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="ml-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full p-2 hover:bg-gray-700 transition-colors duration-200">
                  <CircleDotDashedIcon className="w-5 h-5 text-gray-300" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border border-gray-700 text-white shadow-xl rounded-md w-56">
                  <DropdownMenuLabel
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer transition-colors duration-150 rounded-t-sm"
                  >
                    <PencilIcon className="w-4 h-4 text-indigo-400" />
                    <span>Edit Task</span>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator className="bg-gray-700" />

                  <DropdownMenuLabel className="p-2 text-xs text-gray-400 font-medium">STATUS</DropdownMenuLabel>
                  {["to-do", "in-progress", "completed", "blocked"].map(
                    (status) => (
                      <DropdownMenuLabel
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className="flex items-center gap-3 p-2 pl-4 hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                      >
                        <div className={`w-3 h-3 rounded-full ${statusColors[status]}`}></div>
                        <span className="capitalize">
                          {status.replace("-", " ")}
                        </span>
                        {subtask.status === status && (
                          <CheckIcon className="w-4 h-4 ml-auto text-indigo-400" />
                        )}
                      </DropdownMenuLabel>
                    )
                  )}
                  
                  <DropdownMenuSeparator className="bg-gray-700" />

                  <DropdownMenuLabel className="p-2 text-xs text-gray-400 font-medium">
                    PRIORITY
                  </DropdownMenuLabel>
                  {["high", "medium", "low"].map((priority) => (
                    <DropdownMenuLabel
                      key={priority}
                      onClick={() => handlePriorityChange(priority)}
                      className="flex items-center gap-3 p-2 pl-4 hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                    >
                      <FlagIcon className={`w-4 h-4 ${priorityTextColors[priority]}`} />
                      <span className="capitalize">{priority}</span>
                      {subtask.priority === priority && (
                        <CheckIcon className="w-4 h-4 ml-auto text-indigo-400" />
                      )}
                    </DropdownMenuLabel>
                  ))}
                  
                  <DropdownMenuSeparator className="bg-gray-700" />

                  <DropdownMenuLabel
                    onClick={() => {
                      router.push(`/dashboard/projects/${subtask.parentTask.project}/${subtask.parentTask._id}/${subtask._id}`);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                  >
                    <ArrowRight className="w-4 h-4 text-indigo-400" />
                    <span>View Details</span>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator className="bg-gray-700" />
                  
                  <DropdownMenuLabel className="p-3 hover:bg-red-600/20 cursor-pointer transition-colors duration-150 rounded-b-sm">
                    <AlertBox
                      onConfirm={() => onDelete(subtask.parentTask.project,subtask.parentTask._id, subtask._id)}
                    >
                      <div className="flex items-center gap-3">
                        <TrashIcon className="w-4 h-4 text-red-400" />
                        <span>Delete SubTask</span>
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

export default SubTaskCard;