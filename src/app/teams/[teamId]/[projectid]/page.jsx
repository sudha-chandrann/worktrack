"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { useSelector } from "react-redux";
import AlertBox from "../../../_components/AlertBox"
import NewTodoModal from "../_components/NewTodoModal";
import TodoItem from "../_components/TodoItem";

function ProjectPage({ params }) {
  const { projectid, teamId } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState(null);
  const userId = useSelector((state) => state.user._id);
  const [error, setError] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [progressStats, setProgressStats] = useState({
    completed: 0,
    total: 0,
    percentage: 0,
  });

  const router = useRouter();

  const calculateProgress = (todos) => {
    if (!todos || !todos.length)
      return { completed: 0, total: 0, percentage: 0 };

    const total = todos.length;
    const completed = todos.filter(
      (todo) => todo.status === "completed"
    ).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  };


  const fetchProjectData = useCallback(async () => {
    if (!projectid || !teamId) return;

    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/teams/${teamId}/projects/${projectid}`
      );
      
      const projectData = response.data.data;
      setProject(projectData.project);
      setIsAdmin(projectData.isAdmin);
      setProgressStats(calculateProgress(projectData.project.todos));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to load project data";
      setError(errorMessage);
      console.error("Project data fetch error:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [projectid, teamId]);


  const handleCreateTodo = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `/api/teams/${teamId}/projects/${projectid}`,
        data
      );
      toast.success(response.data.message || "Task created successfully");
      await fetchProjectData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
    } finally {
      setIsSubmitting(false);
      setIsAddingTask(false);
    }
  };


  const handleUpdateTodo = async (id, updateData) => {
    try {
      const response = await axios.patch(
        `/api/teams/${teamId}/projects/${projectid}/todos/${id}`,
        updateData
      );
      toast.success(response.data.message || "Task updated successfully");
       fetchProjectData();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  };


  const handleDeleteTodo = async (id) => {
    try {
      const response = await axios.delete(
        `/api/teams/${teamId}/projects/${projectid}/todos/${id}`
      );
      toast.success(response.data.message || "Task deleted successfully");
       fetchProjectData();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };


  const handleDeleteProject = async () => {

    try {
      setIsDeletingProject(true);
      const response = await axios.delete(
        `/api/teams/${teamId}/projects/${projectid}`
      );
      toast.success(response.data.message || "Project deleted successfully");
      router.push(`/dashboard/teams/${teamId}`);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error(error.response?.data?.message || "Failed to delete project");
      setIsDeletingProject(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} teamId={teamId} router={router} />;
  }

  if (!project) {
    return <NotFoundState router={router} />;
  }

  return (
    <div className="bg-gray-900 min-h-screen w-full overflow-x-hidden pb-8">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        {/* Project Header Card */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 mb-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div
                className="flex items-center justify-center text-3xl h-14 w-14 rounded-lg flex-shrink-0"
                style={{
                  backgroundColor: project.color + "20",
                  color: project.color,
                }}
              >
                {project.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h1
                  className="text-xl sm:text-2xl font-bold mb-1 truncate"
                  style={{ color: project.color }}
                >
                  {project.name}
                </h1>
                <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                  {project.description}
                </p>
              </div>
            </div>
            {isAdmin && (
              <AlertBox onConfirm={handleDeleteProject}>
                <button
                disabled={isDeletingProject}
                className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-700"
                title="Delete Project"
              >
                <Trash2 size={20} />
              </button>
              </AlertBox>

            )}
          </div>

          {/* Project Meta Info */}
          <div className="flex flex-col gap-2 text-xs sm:text-sm text-gray-400 mt-4">
            <div className="flex items-center gap-1">
              <span className="w-24">Created by:</span>
              <span className="font-medium text-gray-300">
                {project.createdBy?.fullName ||
                  project.createdBy?.username ||
                  "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-24">Created At:</span>
              <span className="font-medium text-gray-300">
                {new Date(project.createdAt).toLocaleString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-24">Last Updated:</span>
              <span className="font-medium text-gray-300">
                {new Date(project.updatedAt).toLocaleString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base sm:text-lg font-medium text-white">
              Project Progress
            </h2>
            <span className="text-sm sm:text-base text-gray-300 font-medium">
              {progressStats.percentage}% Complete
            </span>
          </div>

          <div className="w-full h-3 sm:h-4 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressStats.percentage}%`,
                backgroundColor:
                  progressStats.percentage === 100 ? "#10B981" : "#3B82F6",
              }}
            ></div>
          </div>

          <div className="flex justify-between mt-3">
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-gray-300">
                <span className="font-medium">{progressStats.completed}</span>{" "}
                completed
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Clock size={16} className="text-blue-500" />
              <span className="text-gray-300">
                <span className="font-medium">
                  {progressStats.total - progressStats.completed}
                </span>{" "}
                remaining
              </span>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-700 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              Tasks
            </h2>
            {isAdmin && (
              <button
                onClick={() => setIsAddingTask(true)}
                className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
                disabled={isSubmitting}
              >
                <Plus size={16} />
                Add Task
              </button>
            )}
          </div>

          <div className="p-4 sm:p-6">
            {progressStats.total === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-2">No tasks added yet</div>
                <p className="text-sm text-gray-400">
                  {isAdmin
                    ? "Create your first task to get started"
                    : "No tasks have been assigned to this project yet"}
                </p>
              </div>
            ) : (
              <div className="text-gray-300 text-sm flex flex-col gap-2">
                {project.todos.map((todo) => (
                  <TodoItem
                    key={todo._id}
                    onUpdate={handleUpdateTodo}
                    onDelete={handleDeleteTodo}
                    todo={todo}
                    isAdmin={isAdmin}
                    teamId={teamId}
                    userId={userId}
                    members={project.members}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        {isAddingTask && (
          <NewTodoModal
            onClose={() => setIsAddingTask(false)}
            onSubmit={handleCreateTodo}
            isSubmitting={isSubmitting}
            members={project.members}
          />
        )}
      </div>
    </div>
  );
}

export default ProjectPage;

/**
 * Loading state component
 */
function LoadingState() {
  return (
    <div className="bg-gray-900 min-h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-700 border-t-blue-500"></div>
        <p className="text-gray-400">Loading project data...</p>
      </div>
    </div>
  );
}

/**
 * Error state component
 */
function ErrorState({ error, teamId, router }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 w-full p-4">
      <div className="p-6 bg-gray-800 border border-red-500 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-red-500" size={24} />
          <h2 className="text-red-400 text-xl font-semibold">Error</h2>
        </div>
        <p className="text-gray-300 mb-4">{error}</p>
        <button
          onClick={() => router.push(`/dashboard/teams/${teamId}`)}
          className="w-full mt-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <ChevronLeft size={16} />
          Back to Team
        </button>
      </div>
    </div>
  );
}

/**
 * Not found state component
 */
function NotFoundState({ router }) {
  return (
    <div className="bg-gray-900 flex items-center justify-center min-h-screen w-full p-4">
      <div className="p-6 bg-gray-800 border border-yellow-500 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-yellow-500" size={24} />
          <h2 className="text-yellow-400 text-xl font-semibold">
            Project Not Found
          </h2>
        </div>
        <p className="text-gray-300 mb-4">
          The requested project could not be found.
        </p>
        <button
          onClick={() => router.back()}
          className="w-full mt-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}