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
  TagIcon,
  TrashIcon,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenuLabel, DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"
import AlertBox from "../../../_components/AlertBox"

const TodoItem = ({ todo, onUpdate, onDelete, isAdmin, teamId, userId, members }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(
    todo.description || ""
  );
  const [selectedMember, setSelectedMember] = useState(todo.assignedTo._id);
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
    onUpdate(todo._id, { status: newStatus });
  };

  const handlePriorityChange = (newPriority) => {
    onUpdate(todo._id, { priority: newPriority });
  };

  const handleSaveEdit = () => {
    onUpdate(todo._id, {
      title: editedTitle,
      description: editedDescription,
      assignedTo: selectedMember,
    });
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    const newStatus = todo.status === "completed" ? "to-do" : "completed";
    onUpdate(todo._id, {
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
      className={`bg-gray-900 rounded-lg p-4 border-l-4 ${
        todo.status === "completed"
          ? "border-green-500 opacity-70"
          : priorityColors[todo.priority]
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
            placeholder="Description (optional)"
          />
          
          {/* Reassign option */}

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Reassign To:</label>           
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
              >
                  <option value={todo.assignedTo._id}>Select a team member</option>
                  {members && members.map((member) => (
                    <option key={member.user._id} value={member.user._id}>
                      {member.user.fullName} ({member.role})
                    </option>
                  ))}
              </select>
            </div>

          
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
            {
                userId === todo.assignedTo._id && (
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
                )
            }


            <div className="flex-grow">
              <h3
                className={`font-medium ${
                  todo.status === "completed"
                    ? "line-through text-gray-400"
                    : "text-white"
                }`}
              >
                {todo.title}
              </h3>

              {todo.description && (
                <p className="text-gray-300 text-sm mt-1">{todo.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-300">
                {todo.dueDate && (
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{formatDueDate(todo.dueDate)}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <FlagIcon className={`w-4 h-4 ${prioritytextColors[todo.priority]}`} />
                  <span className="capitalize">{todo.priority}</span>
                </div>

                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-white ${
                    statusColors[todo.status]
                  }`}
                >
                  <span className="capitalize">
                    {todo.status.replace("-", " ")}
                  </span>
                </div>

                {todo.tags && todo.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <TagIcon className="w-4 h-4" />
                    <span>{todo.tags.join(", ")}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-300">
                {todo.isPersonal && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600 text-white">
                    <span>Personal</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <User className={`w-4 h-4 ${prioritytextColors[todo.priority]}`} /> AssignedTo:
                  <span className="capitalize">{userId === todo.assignedTo._id ? " me":`@${todo.assignedTo.username}`} </span>
                </div>
                <div className="flex items-center gap-1">
                  <User className={`w-4 h-4 ${prioritytextColors[todo.priority]}`} /> AssignedBy:
                  <span className="capitalize">{userId === todo.assignedBy._id ? " me":`@${todo.assignedBy.username}`} </span>
                </div>
              </div>
            </div>

            <div className="relative">
              {
                isAdmin ? (
                    <DropdownMenu>
                    <DropdownMenuTrigger className=" rounded-full hover:bg-gray-700 ">
                      <CircleDotDashedIcon className="w-5 h-5 text-gray-300 " />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-800 text-white ">
                      <DropdownMenuLabel
                        onClick={() => {
                          setIsEditing(true);
                        }}
                        className="flex items-center justify-start gap-3 p-3 hover:bg-gray-900 cursor-pointer"
                      >
                        <PencilIcon className="w-4 h-4 " />
                        Edit
                      </DropdownMenuLabel>
                      

                      
                      <DropdownMenuSeparator />
    
                      <DropdownMenuLabel className="p-1">Status</DropdownMenuLabel>
                      {["to-do", "in-progress", "completed", "blocked"].map(
                        (status) => (
                          <DropdownMenuLabel
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            className="flex items-center gap-2 p-2  hover:bg-gray-900 cursor-pointer"
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
    
                      <DropdownMenuLabel className="p-1">Priority</DropdownMenuLabel>
                      {["high", "medium", "low"].map((priority) => (
                        <DropdownMenuLabel
                          key={priority}
                          onClick={() => handlePriorityChange(priority)}
                          className="flex items-center gap-2 p-2 hover:bg-gray-900 cursor-pointer"
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
                            `/teams/${teamId}/${todo.project}/${todo._id}/`
                          );
                        }}
                        className="flex items-center justify-start gap-3 p-2 hover:bg-gray-900 cursor-pointer"
                      >
                        {" "}
                        <ArrowRight className="w-5 h-5" />
                        Go to
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel
                        className="flex items-center justify-start gap-3 p-2  hover:bg-gray-900 cursor-pointer"
                      >
                        <AlertBox onConfirm={()=>{onDelete(todo._id)}}>
                            <div className=" flex items-center gap-2">
                            <TrashIcon className="w-4 h-4" />
                            Delete
                            </div>
                        </AlertBox>
                      </DropdownMenuLabel>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ):(
                    <DropdownMenu>
                    <DropdownMenuTrigger className=" rounded-full hover:bg-gray-700 ">
                      <CircleDotDashedIcon className="w-5 h-5 text-gray-300 " />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-800 text-white ">
                      <DropdownMenuLabel
                        onClick={() => {
                          router.push(
                            `/teams/${teamId}/${todo.project}/${todo._id}/`
                          );
                        }}
                        className="flex items-center justify-start gap-3 p-2 hover:bg-gray-900 cursor-pointer"
                      >
                        {" "}
                        <ArrowRight className="w-5 h-5" />
                        Go to
                      </DropdownMenuLabel>
                    </DropdownMenuContent>
                  </DropdownMenu> 
                )
              }

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;