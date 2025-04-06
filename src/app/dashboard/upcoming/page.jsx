"use client";

import axios from "axios";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  PlusIcon,
  XOctagon,
  FilterIcon,
  SortAscIcon,
} from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import TodoCard from "../today/_components/TodoCard"


function UpcomingTasksPage() {
  // State management
  const [todosData, setTodosData] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("priority");


  const applyFiltersAndSort = useCallback((todos, filter, sort) => {
    let filtered = [...todos];

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((todo) => todo.status === filter);
    }

    // Apply sorting
    if (sort === "priority") {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      filtered.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    } else if (sort === "dueDate") {
      filtered.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }

    setFilteredTodos(filtered);
  }, []);


  const fetchUpcomingTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/users/getupcomingtodos");
      const todos = Array.isArray(response.data.data) ? response.data.data : [];
      setTodosData(todos);
      applyFiltersAndSort(todos, activeFilter, sortOrder);
    } catch (err) {
      console.error("Fetch upcoming todos error:", err);
      setError("Failed to load upcoming tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [ applyFiltersAndSort, activeFilter, sortOrder]);

// Updates a todo
  const handleUpdateTodo = async (projectId, todoId, updateData) => {
    try {
      setIsSubmitting(true);
      const response = await axios.patch(
        `/api/projects/${projectId}/todos/${todoId}`,
        updateData
      );
      toast.success(response.data.message || "Task updated successfully");
      fetchUpcomingTodos();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
      console.error("Update todo error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

//  Deletes a todo
  const handleDeleteTodo = async (projectId, todoId) => {
    try {
      setIsSubmitting(true);
      const response = await axios.delete(
        `/api/projects/${projectId}/todos/${todoId}`
      );
      toast.success(response.data.message || "Task deleted successfully");
      fetchUpcomingTodos();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
      console.error("Delete todo error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

//  Handles filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    applyFiltersAndSort(todosData, filter, sortOrder);
  };

  const handleSortChange = (sort) => {
    setSortOrder(sort);
    applyFiltersAndSort(todosData, activeFilter, sort);
  };

  // Initial data fetch
  useEffect(() => {
    fetchUpcomingTodos();
  }, [fetchUpcomingTodos]);

  // Calculate task counts
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
            onClick={fetchUpcomingTodos}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Trying..." : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!todosData.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 bg-gray-900">
        <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 max-w-md w-full text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-xl font-semibold text-white">
            No upcoming tasks
          </h3>
          <p className="mt-2 text-gray-400">
            You don&apos;t have any upcoming tasks. Add a new task to get started.
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
              Upcoming Tasks
            </h1>
            <p className="mt-1 text-gray-300 font-medium">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
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
        
        {/* Action bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filters */}
            <div className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4 text-gray-400" />
              <div className="flex  flex-wrap  bg-gray-700 rounded-lg">
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-l-lg transition-colors ${
                    activeFilter === "all"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange("to-do")}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeFilter === "to-do"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  To-do
                </button>
                <button
                  onClick={() => handleFilterChange("in-progress")}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeFilter === "in-progress"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleFilterChange("completed")}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeFilter === "completed"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => handleFilterChange("blocked")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-r-lg transition-colors ${
                    activeFilter === "blocked"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Blocked
                </button>
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 ml-4">
              <SortAscIcon className="h-4 w-4 text-gray-400" />
              <select
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1.5 border-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="priority">Priority</option>
                <option value="dueDate">Due Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task list */}
        <div className="space-y-3 mt-4">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <TodoCard
                key={todo._id}
                todo={todo}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
                disabled={isSubmitting}
              />
            ))
          ) : (
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-center">
              <p className="text-gray-300">No tasks match your current filters</p>
              <button
                onClick={() => handleFilterChange("all")}
                className="mt-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                disabled={isSubmitting}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpcomingTasksPage;