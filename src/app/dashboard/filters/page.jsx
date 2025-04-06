"use client";

import axios from "axios";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  XOctagon,
} from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";



function UpcomingTasksPage() {
  // State management
  const [todosData, setTodosData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFilterTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/users/getalltodos");
      // Ensure we have an array of todos
      const todos = Array.isArray(response.data.data) ? response.data.data : [];
      setTodosData(todos);
    } catch (err) {
      console.error("Fetch upcoming todos error:", err);
      setError("Failed to load upcoming tasks. Please try again.");
      // Reset data to empty array on error
      setTodosData([]);
      setFilteredTodos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);


  // Initial data fetch
  useEffect(() => {
    fetchFilterTodos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
   
  const todoCountByStatus = Array.isArray(todosData) 
  ? todosData.reduce((acc, todo) => {
      acc[todo.status] = (acc[todo.status] || 0) + 1;
      return acc;
    }, {})
  : {};

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-300">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 bg-gray-900">
        <div className="bg-red-500/10 p-6 rounded-lg border border-red-500/20 max-w-md w-full">
          <h3 className="text-xl font-semibold text-red-400 mb-2">Error</h3>
          <p className="text-gray-300">{error}</p>
          <button
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Trying..." : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  // Empty state - ensuring todosData is an array first
  if (!Array.isArray(todosData) || todosData.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 bg-gray-900">
        <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 max-w-md w-full text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-xl font-semibold text-white">
            No  tasks
          </h3>
          <p className="mt-2 text-gray-400">
            You don&apos;t have any  tasks. Add a new task to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col pb-20 bg-gray-900 relative">
      {/* Task List */}
      <div className="space-y-3 px-4 w-full max-w-5xl mx-auto py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="h-6 w-6 text-indigo-400" />
            </h1>
            <p className="mt-1 text-gray-300 font-medium">

            </p>
          </div>

          {/* Task summary */}
          <div className="flex flex-wrap items-center gap-4 text-gray-300">
            <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-full">
              <Circle className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium">
                To-do: {todoCountByStatus["to-do"] || 0}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-full">
              <Clock className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium">
                In progress: {todoCountByStatus["in-progress"] || 0}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium">
                Completed: {todoCountByStatus["completed"] || 0}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-full">
              <XOctagon className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium">
                Blocked: {todoCountByStatus["blocked"] || 0}
              </span>
            </div>
          </div>
        </div>
        



      </div>
    </div>
  );
}

export default UpcomingTasksPage;