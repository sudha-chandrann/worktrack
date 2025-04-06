"use client";

import axios from "axios";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  XOctagon,
  FilterIcon,
  SortAscIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, addDays, subDays } from "date-fns";
import toast from "react-hot-toast";
import TodoCard from "../today/_components/TodoCard";


function UpcomingTasksPage() {
  // State management
  const [todosData, setTodosData] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("priority");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateFilterActive, setDateFilterActive] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const findTodosByDate = useCallback((todos, searchDate) => {
    // Guard clause for empty todos array
    if (!Array.isArray(todos) || todos.length === 0) {
      return [];
    }

    // Handle different date formats
    let targetDate;
    if (searchDate instanceof Date) {
      targetDate = searchDate;
    } else if (typeof searchDate === 'string') {
      targetDate = parseISO(searchDate);
    } else {
      console.error("Invalid date format provided");
      return [];
    }
    
    // Create start and end of day boundaries
    const dayStart = startOfDay(targetDate);
    const dayEnd = endOfDay(targetDate);
    
    // Filter todos that fall within the specified date
    return todos.filter((todo) => {
      if (!todo.dueDate) return false;
      
      const taskDate = parseISO(todo.dueDate);
      return isWithinInterval(taskDate, {
        start: dayStart,
        end: dayEnd
      });
    });
  }, []);


  const applyFiltersAndSort = useCallback((todos, filter, sort, date, dateActive) => {
    // Ensure todos is an array
    const todosArray = Array.isArray(todos) ? todos : [];
    let filtered = [...todosArray];

    // Apply date filter if active
    if (dateActive && date) {
      filtered = findTodosByDate(filtered, date);
    }

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((todo) => todo.status === filter);
    }

    // Apply sorting
    if (sort === "priority") {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      filtered.sort(
        (a, b) => (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4)
      );
    } else if (sort === "dueDate") {
      filtered.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }

    setFilteredTodos(filtered);
  }, [findTodosByDate]);


  const getTodosForDate = useCallback((date) => {
    return findTodosByDate(todosData, date);
  }, [todosData, findTodosByDate]);


  const fetchFilterTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/users/getalltodos");
      // Ensure we have an array of todos
      const todos = Array.isArray(response.data.data) ? response.data.data : [];
      setTodosData(todos);
      applyFiltersAndSort(todos, activeFilter, sortOrder, selectedDate, dateFilterActive);
    } catch (err) {
      console.error("Fetch upcoming todos error:", err);
      setError("Failed to load upcoming tasks. Please try again.");
      // Reset data to empty array on error
      setTodosData([]);
      setFilteredTodos([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, sortOrder, selectedDate, dateFilterActive, applyFiltersAndSort]);

  const handleUpdateTodo = async (projectId, todoId, updateData) => {
    if (!projectId || !todoId) {
      toast.error("Invalid task data");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await axios.patch(
        `/api/projects/${projectId}/todos/${todoId}`,
        updateData
      );
      toast.success(response.data.message || "Task updated successfully");
      fetchFilterTodos();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
      console.error("Update todo error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleDeleteTodo = async (projectId, todoId) => {
    if (!projectId || !todoId) {
      toast.error("Invalid task data");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await axios.delete(
        `/api/projects/${projectId}/todos/${todoId}`
      );
      toast.success(response.data.message || "Task deleted successfully");
      fetchFilterTodos();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
      console.error("Delete todo error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    applyFiltersAndSort(todosData, filter, sortOrder, selectedDate, dateFilterActive);
  };


  const handleSortChange = (sort) => {
    setSortOrder(sort);
    applyFiltersAndSort(todosData, activeFilter, sort, selectedDate, dateFilterActive);
  };


  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDateFilterActive(true);
    applyFiltersAndSort(todosData, activeFilter, sortOrder, date, true);
    setShowDatePicker(false);
  };


  const clearDateFilter = () => {
    setDateFilterActive(false);
    applyFiltersAndSort(todosData, activeFilter, sortOrder, null, false);
  };

  const nextDay = () => {
    const nextDate = addDays(selectedDate, 1);
    handleDateChange(nextDate);
  };

  const previousDay = () => {
    const prevDate = subDays(selectedDate, 1);
    handleDateChange(prevDate);
  };



  // Initial data fetch
  useEffect(() => {
    fetchFilterTodos();
  }, [fetchFilterTodos]);

  // Calculate task counts - ensuring todosData is an array first
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
            onClick={fetchFilterTodos}
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
              {dateFilterActive 
                ? `Tasks for ${format(selectedDate, "MMMM d, yyyy")}`
                : " Tasks"
              }
            </h1>
            <p className="mt-1 text-gray-300 font-medium">
              {dateFilterActive && 
                <button 
                  onClick={clearDateFilter}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Clear date filter
                </button>
              }
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
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          {/* Date filter */}
          <div className="flex items-center space-x-2 relative">
            {dateFilterActive && (
              <button 
                onClick={previousDay} 
                className="p-1 rounded-full hover:bg-gray-700 text-gray-300"
                aria-label="Previous day"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
            )}
            
            <button
              onClick={() => setShowDatePicker(prev => !prev)}
              className={`flex items-center gap-2 ${dateFilterActive ? 'bg-indigo-600' : 'bg-gray-700'} text-white px-3 py-2 rounded-lg transition-colors`}
              aria-label="Select date"
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">{dateFilterActive ? format(selectedDate, "MMM d") : "Filter by Date"}</span>
            </button>
            
            {dateFilterActive && (
              <button 
                onClick={nextDay} 
                className="p-1 rounded-full hover:bg-gray-700 text-gray-300"
                aria-label="Next day"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            )}
            
            {showDatePicker && (
              <div className="absolute top-12 z-10 bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-2">
                <div className="flex justify-between mb-2">
                  <button
                    onClick={() => handleDateChange(new Date())}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="text-xs text-gray-400 hover:text-gray-300"
                  >
                    Close
                  </button>
                </div>
                <input
                  type="date"
                  className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 text-sm"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleDateChange(new Date(e.target.value));
                    }
                  }}
                  value={format(selectedDate, "yyyy-MM-dd")}
                />
              </div>
            )}

            {/* Quick date selectors */}
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => handleDateChange(new Date())}
                className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => handleDateChange(addDays(new Date(), 1))}
                className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded transition-colors"
              >
                Tomorrow
              </button>
            </div>
          </div>

          {/* Status filter */}
          <div className="flex items-center space-x-2">
            <FilterIcon className="h-4 w-4 text-gray-400" />
            <select
              className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 text-sm"
              value={activeFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="to-do">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center space-x-2">
            <SortAscIcon className="h-4 w-4 text-gray-400" />
            <select
              className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 text-sm"
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="priority">Sort by Priority</option>
              <option value="dueDate">Sort by Due Date</option>
            </select>
          </div>
        </div>

        {/* Tasks */}
        <div className="space-y-3 mt-6">
          {dateFilterActive && filteredTodos.length === 0 ? (
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-center">
              <p className="text-gray-300">No tasks found for {format(selectedDate, "MMMM d, yyyy")}</p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoCard
                key={todo._id}
                todo={todo}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
                disabled={isSubmitting}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default UpcomingTasksPage;