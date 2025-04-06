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
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import DailyCountdownTimer from "./_components/DailyCountdownTimer"
import NewTodoModal from "../inbox/_components/NewTodoModal"
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import TodoCard from "./_components/TodoCard";
import SubTaskCard from "./_components/SubTaskCard";

function TodayTasksPage() {
  const [todosData, setTodosData] = useState([]);
  const [subtasksData, setSubtasks] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [filteredSubtasks, setFilteredSubtasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewTodoModalOpen, setIsNewTodoModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("priority"); 
  const [activeSubtaskFilter, setActiveSubtaskFilter] = useState("all");



  const [subtaskSortOrder, setSubtaskSortOrder] = useState("priority");

  const inboxId = useSelector((state) => state.user.inbox);

  // Create a new todo
  const handleCreateTodo = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(`/api/projects/${inboxId}`, data);
      toast.success(response.data.message || "Task created successfully");
      fetchTodayTodos();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
      console.error("Create todo error:", error);
    } finally {
      setIsSubmitting(false);
      setIsNewTodoModalOpen(false);
    }
  };

  // Update a todo
  const handleUpdateTodo = async (projectId, todoId, updateData) => {
    try {
      const response = await axios.patch(
        `/api/projects/${projectId}/todos/${todoId}`,
        updateData
      );
      toast.success(response.data.message || "Task updated successfully");
      fetchTodayTodos();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
      console.error("Update todo error:", error);
    }
  };

  // Delete a todo
  const handleDeleteTodo = async (projectId, todoId) => {
    try {
      const response = await axios.delete(
        `/api/projects/${projectId}/todos/${todoId}`
      );
      toast.success(response.data.message || "Task deleted successfully");
      fetchTodayTodos();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
      console.error("Delete todo error:", error);
    }
  };

  const handleSubtaskUpdate = async (
    ProjectId,
    todoId,
    subtaskId,
    updatedData
  ) => {
    try {
      const response = await axios.patch(
        `/api/projects/${ProjectId}/todos/${todoId}/${subtaskId}`,
        updatedData
      );
      toast.success(response.data.message || "Todo is Updated Successfully");
      fetchTodayTodos();
    } catch (error) {
      console.log(" the error in updating todo ", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleSubtaskDelete = async (ProjectId, todoId, subtaskId) => {
    try {
      const response = await axios.delete(
        `/api/projects/${ProjectId}/todos/${todoId}/${subtaskId}`
      );
      toast.success(response.data.message || "Todo is deleted Successfully");
      fetchTodayTodos();
    } catch (error) {
      console.log(" the error in updating todo ", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Fetch today's todos
  const fetchTodayTodos = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/users/gettodaytodos");
      const todos = response.data.data.todos || [];
      const subtasks = response.data.data.subtasks || [];
      setSubtasks(subtasks);
      setTodosData(todos);
      applyFiltersAndSort(todos, activeFilter, sortOrder);
      applySubtaskFiltersAndSort(
        subtasks,
        activeSubtaskFilter,
        subtaskSortOrder
      );
    } catch (err) {
      console.error("Fetch todos error:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters and sorting for main todos
  const applyFiltersAndSort = (todos, filter, sort) => {
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
  };

  // Apply filters and sorting for subtasks
  const applySubtaskFiltersAndSort = (subtasks, filter, sort) => {
    let filtered = [...subtasks];

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((subtask) => subtask.status === filter);
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

    setFilteredSubtasks(filtered);
  };

  // Handle filter change for main todos
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    applyFiltersAndSort(todosData, filter, sortOrder);
  };

  // Handle sort change for main todos
  const handleSortChange = (sort) => {
    setSortOrder(sort);
    applyFiltersAndSort(todosData, activeFilter, sort);
  };

  // Handle filter change for subtasks
  const handleSubtaskFilterChange = (filter) => {
    setActiveSubtaskFilter(filter);
    applySubtaskFiltersAndSort(subtasksData, filter, subtaskSortOrder);
  };

  // Handle sort change for subtasks
  const handleSubtaskSortChange = (sort) => {
    setSubtaskSortOrder(sort);
    applySubtaskFiltersAndSort(subtasksData, activeSubtaskFilter, sort);
  };

  // Initial data fetch
  useEffect(() => {
    fetchTodayTodos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate task counts
  const todoCountByStatus = todosData.reduce((acc, todo) => {
    acc[todo.status] = (acc[todo.status] || 0) + 1;
    return acc;
  }, {});

  // Calculate subtask counts
  const subtaskCountByStatus = subtasksData.reduce((acc, subtask) => {
    acc[subtask.status] = (acc[subtask.status] || 0) + 1;
    return acc;
  }, {});

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
            onClick={fetchTodayTodos}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!todosData.length && !subtasksData.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 bg-gray-900">
        <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 max-w-md w-full text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-xl font-semibold text-white">
            No tasks and Subtasks for today
          </h3>
          <p className="mt-2 text-gray-400">
            You don&apos;t have any tasks due today. Enjoy your day or add a new
            task to get started.
          </p>
          <button
            onClick={() => setIsNewTodoModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors mx-auto mt-3"
          >
            <PlusIcon className="h-5 w-5" />
            Add Task
          </button>
        </div>
        {isNewTodoModalOpen && (
          <NewTodoModal
            onClose={() => setIsNewTodoModalOpen(false)}
            onSubmit={handleCreateTodo}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    );
  }

  if (!todosData.length && subtasksData.length) {
    return (
      <div className="flex min-h-screen flex-col pb-20 bg-gray-900 relative w-full">
        <div className=" flex flex-wrap p-4 justify-between items-center w-full">
          <h3 className="mt-4 text-xl font-semibold text-white">
            No tasks for today
          </h3>
          <button
            onClick={() => setIsNewTodoModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors  mt-3"
          >
            <PlusIcon className="h-5 w-5" />
            Add Task
          </button>
        </div>
        <div className="flex flex-wrap p-4 md:items-center justify-between  w-full gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="h-6 w-6 text-indigo-400" />
              Today&lsquo;s SubTasks
            </h1>
            <p className="mt-1 text-gray-300 font-medium">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-gray-300">
            <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-full">
              <Circle className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium">
                To-do: {subtaskCountByStatus["to-do"] || 0}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-full">
              <Clock className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium">
                In progress: {subtaskCountByStatus["in-progress"] || 0}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium">
                Completed: {subtaskCountByStatus["completed"] || 0}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-full">
              <XOctagon className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium">
                Blocked: {subtaskCountByStatus["blocked"] || 0}
              </span>
            </div>
          </div>
        </div>
        <div className=" flex items-center justify-between flex-wrap p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <FilterIcon className="h-4 w-4 text-gray-400" />
              <div className="flex bg-gray-700 rounded-lg">
                <button
                  onClick={() => handleSubtaskFilterChange("all")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-l-lg transition-colors ${
                    activeSubtaskFilter === "all"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleSubtaskFilterChange("to-do")}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeSubtaskFilter === "to-do"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  To-do
                </button>
                <button
                  onClick={() => handleSubtaskFilterChange("in-progress")}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeSubtaskFilter === "in-progress"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleSubtaskFilterChange("completed")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-r-lg transition-colors ${
                    activeSubtaskFilter === "completed"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <SortAscIcon className="h-4 w-4 text-gray-400" />
              <select
                value={sortOrder}
                onChange={(e) => handleSubtaskSortChange(e.target.value)}
                className="bg-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1.5 border-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="priority">Priority</option>
                <option value="dueDate">Due Date</option>
              </select>
            </div>
          </div>
          <div className="ml-auto">
            <DailyCountdownTimer />
          </div>
        </div>
        <div className="space-y-3 px-4  w-full max-w-5xl mx-auto py-4">
          {subtasksData.map((subtask) => (
            <SubTaskCard
              key={subtask._id}
              subtask={subtask}
              onDelete={handleSubtaskDelete}
              onUpdate={handleSubtaskUpdate}
            />
          ))}
        </div>

        {isNewTodoModalOpen && (
          <NewTodoModal
            onClose={() => setIsNewTodoModalOpen(false)}
            onSubmit={handleCreateTodo}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col pb-20 bg-gray-900 relative">
      {/* Main Header */}
      <div className="border-b border-gray-800 bg-gray-800/90 p-2 flex items-center justify-center w-full">
        <DailyCountdownTimer />
      </div>

      {/* Task List */}
      <div className="space-y-3 px-4  w-full max-w-5xl mx-auto py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="h-6 w-6 text-indigo-400" />
              Today&lsquo;s Tasks
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
        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          <button
            onClick={() => setIsNewTodoModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Task
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filters */}
            <div className="flex items-center gap-2 ml-4">
              <FilterIcon className="h-4 w-4 text-gray-400" />
              <div className="flex bg-gray-700 rounded-lg">
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
                  className={`px-3 py-1.5 text-sm font-medium rounded-r-lg transition-colors ${
                    activeFilter === "completed"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Completed
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

        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <TodoCard
              key={todo._id}
              todo={todo}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
            />
          ))
        ) : (
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-center">
            <p className="text-gray-300">No tasks match your current filters</p>
            <button
              onClick={() => handleFilterChange("all")}
              className="mt-2 text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {subtasksData.length > 0 ? (
        <div className="space-y-3 px-4  w-full max-w-5xl mx-auto py-4">
          <div className="flex flex-wrap p-4 md:items-center justify-between  w-full gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Calendar className="h-6 w-6 text-indigo-400" />
                Today&lsquo;s SubTasks
              </h1>
              <p className="mt-1 text-gray-300 font-medium">
                {format(new Date(), "EEEE, MMMM d, yyyy")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-gray-300">
              <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-full">
                <Circle className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium">
                  To-do: {subtaskCountByStatus["to-do"] || 0}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-full">
                <Clock className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium">
                  In progress: {subtaskCountByStatus["in-progress"] || 0}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium">
                  Completed: {subtaskCountByStatus["completed"] || 0}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-full">
                <XOctagon className="h-4 w-4 text-red-400" />
                <span className="text-sm font-medium">
                  Blocked: {subtaskCountByStatus["blocked"] || 0}
                </span>
              </div>
            </div>
          </div>
          {/* Action bar */}
          <div className=" flex items-center justify-center flex-wrap p-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <FilterIcon className="h-4 w-4 text-gray-400" />
                <div className="flex bg-gray-700 rounded-lg">
                  <button
                    onClick={() => handleSubtaskFilterChange("all")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-l-lg transition-colors ${
                      activeSubtaskFilter === "all"
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleSubtaskFilterChange("to-do")}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                      activeSubtaskFilter === "to-do"
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    To-do
                  </button>
                  <button
                    onClick={() => handleSubtaskFilterChange("in-progress")}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                      activeSubtaskFilter === "in-progress"
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleSubtaskFilterChange("completed")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-r-lg transition-colors ${
                      activeSubtaskFilter === "completed"
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <SortAscIcon className="h-4 w-4 text-gray-400" />
                <select
                  value={sortOrder}
                  onChange={(e) => handleSubtaskSortChange(e.target.value)}
                  className="bg-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1.5 border-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="priority">Priority</option>
                  <option value="dueDate">Due Date</option>
                </select>
              </div>
            </div>
          </div>
          {filteredSubtasks.map((subtask) => (
            <SubTaskCard
              key={subtask._id}
              subtask={subtask}
              onDelete={handleSubtaskDelete}
              onUpdate={handleSubtaskUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3 px-4  w-full max-w-5xl mx-auto py-4">
          <div className="flex  flex-col items-center justify-center p-8">
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 max-w-md w-full text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-xl font-semibold text-white">
                No subtasks for today
              </h3>
              <p className="mt-2 text-gray-400">
                You don&apos;t have any tasks due today. Enjoy your day or add a
                new task to get started.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* New Todo Modal */}
      {isNewTodoModalOpen && (
        <NewTodoModal
          onClose={() => setIsNewTodoModalOpen(false)}
          onSubmit={handleCreateTodo}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

export default TodayTasksPage;
