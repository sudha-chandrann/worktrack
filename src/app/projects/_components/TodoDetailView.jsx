// components/TodoDetailView.jsx
"use client";
import React, { useState, useEffect } from "react";
import { formatDate } from "date-fns";
import StatusBadge from "./StatusBadge";
import PriorityTag from "./PriorityTag";
import DueDate from "./DueDate";
import TodoInformationSection from "./TodoInformationSection";
import TagsList from "./TagsList";
import TodoEditForm from "./TodoEditForm";
import PastDueAlert from "./PastDueAlert";
import AlertBox from "../../_components/AlertBox"


const TodoDetailView = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPastDue, setIsPastDue] = useState(false);
  const [minDate, setMinDate] = useState("");

  // Set today's date as minimum date and check if due date is past
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

  const formatDueDate = (date) => {
    if (!date) return null;
    return formatDate(new Date(date), "MMM d, yyyy");
  };

  return (
    <div className="bg-gray-800 text-gray-100 rounded-lg shadow-md p-6">
      {isPastDue && <PastDueAlert />}
      
      {!isEditing ? (
        <>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold mb-2">{todo.title}</h2>

            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
              >
                ✏️ Edit
              </button>
              <AlertBox onConfirm={onDelete}>
              <button
                onClick={onDelete}
                className="px-3 py-1 bg-red-900 hover:bg-red-800 text-red-200 rounded-md text-sm"
              >
                🗑️ Delete
              </button>
              </AlertBox>

            </div>
          </div>

          <div className="flex items-center gap-2 mb-4 w-full md:gap-4 flex-wrap">
            <StatusBadge status={todo.status} />
            <PriorityTag priority={todo.priority} />
            {todo.dueDate && (
              <DueDate date={todo.dueDate} isPastDue={isPastDue} formatDueDate={formatDueDate} />
            )}
          </div>

          <div className="mb-6 text-gray-300">
            {todo.description ? (
              <div className="flex flex-wrap gap-2">
                <span className="font-medium text-gray-400">
                  Description:{" "}
                </span>
                <p className="whitespace-pre-line">{todo.description}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">No description provided</p>
            )}
          </div>

          <TodoInformationSection todo={todo} />

          {todo.tags && todo.tags.length > 0 && (
            <TagsList tags={todo.tags} />
          )}
        </>
      ) : (
        <TodoEditForm
          todo={todo} 
          minDate={minDate} 
          onCancel={() => setIsEditing(false)} 
          onSubmit={handleSaveEdit} 
        />
      )}
    </div>
  );
};

export default TodoDetailView;