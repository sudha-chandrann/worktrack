"use client";
import NewTodoModal from "../../inbox/_components/NewTodoModal"
import TodoCard from "../../inbox/_components/TodoCard"
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import AlertBox from "../../../_components/AlertBox"
import { useDispatch, useSelector } from "react-redux";
import { removeProject } from "../../../../store/userSlice";

function Page({ params }) {
  const { ProjectId } = params;
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState({});
  const [error, setError] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressStats, setProgressStats] = useState({
    completed: 0,
    total: 0,
    percentage: 0,
  });

  const router = useRouter();
  const dispatch= useDispatch();
  const inboxId= useSelector((state)=>state.user.inbox);

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

  const handleCreateTodo = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(`/api/projects/${ProjectId}`, data);
      toast.success(response.data.message);
      fetchProjectData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
      setIsAddingTask(false);
    }
  };

  const handleUpdateTodo = async (id, updateData) => {
    try {
      const response = await axios.patch(
        `/api/projects/${ProjectId}/todos/${id}`,
        updateData
      );
      toast.success(response.data.message || "Task updated successfully");
      fetchProjectData();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await axios.delete(
        `/api/projects/${ProjectId}/todos/${id}`
      );
      toast.success(response.data.message || "Task deleted successfully");
      fetchProjectData();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const fetchProjectData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/projects/${ProjectId}`);
      setProject(response.data.data);
      setProgressStats(calculateProgress(response.data.data.todos));
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectDelete = async () => {
    try {
      const response = await axios.delete(`/api/projects/${ProjectId}`);
      toast.success(response.data.message || "Project deleted successfully");
      dispatch(removeProject(response.data.data))
      router.push(`/dashboard/inbox`);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (ProjectId) {
      fetchProjectData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ProjectId]);

  if (isLoading) {
    return (
      <div className="bg-gray-900 h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="p-6 bg-gray-800 border border-red-500 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-red-500" size={24} />
            <h2 className="text-red-400 text-xl font-semibold">Error</h2>
          </div>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard/today')}
            className="w-full mt-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ChevronLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-gray-900 flex items-center justify-center h-screen">
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
            onClick={() => router.push('/dashboard/today')}
            className="w-full mt-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ChevronLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard/today')}
            className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors duration-200"
          >
            <ChevronLeft size={16} />
            Back to Dashboard
          </button>
          {
            inboxId !== ProjectId && (
             <AlertBox onConfirm={handleProjectDelete}>
                <button className="px-4 py-2 bg-red-900/70 hover:bg-red-800 text-red-100 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 border border-red-800/50">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </AlertBox>
            )
          }

        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
          <div className="flex items-center gap-6">
            <div
              className="flex items-center justify-center text-4xl h-16 w-16 rounded-lg"
              style={{
                backgroundColor: project.color + "20",
                color: project.color,
              }}
            >
              {project.icon}
            </div>
            <div className="flex-1">
              <h2
                className="text-2xl font-bold mb-1"
                style={{ color: project.color }}
              >
                {project.name}
              </h2>
              <p className="text-gray-300 mb-2">{project.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Created by</span>
                <span className="font-medium text-gray-300">
                  {project.createdBy?.username}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-white">Project Progress</h3>
            <span className="text-gray-300 font-medium">
              {progressStats.percentage}% Complete
            </span>
          </div>

          <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
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
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-gray-300">
                <span className="font-medium">{progressStats.completed}</span>{" "}
                completed
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
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

        <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Tasks</h3>
            <button
              onClick={() => setIsAddingTask(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Task
            </button>
          </div>

          {isAddingTask && (
            <NewTodoModal
              onClose={() => setIsAddingTask(false)}
              onSubmit={handleCreateTodo}
              isSubmitting={isSubmitting}
            />
          )}

          <div className="p-6">
            {project.todos?.length > 0 ? (
              <div className="space-y-4">
                {project.todos.map((todo) => (
                  <TodoCard
                    key={todo._id}
                    todo={todo}
                    onDelete={handleDeleteTodo}
                    onUpdate={handleUpdateTodo}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-gray-700 p-4 rounded-full mb-4">
                  <AlertCircle className="text-gray-400" size={24} />
                </div>
                <p className="text-gray-400 mb-2">No tasks available.</p>
                <p className="text-gray-500 text-sm">
                  Start adding tasks to track your project progress.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;

const Spinner = () => (
  <div className="flex flex-col items-center gap-3">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-700 border-t-blue-500"></div>
    <p className="text-gray-400">Loading project data...</p>
  </div>
);
