"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import TodoDetailView from "./_components/TodoDetailView";
import AddSubtaskForm from "./_components/AddSubtaskForm";
import SubtaskList from "./_components/SubtaskList";

function Page({ params }) {
  const { projectid, todoId, teamId } = params;
  const [tododata, settododata] = useState(null);
  const [teammembers, setteammembers] = useState([]);
  const [isAdmin, setisAdmin] = useState([]);
  const [isLoading, setisloading] = useState(false);
  const [error, seterror] = useState(null);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const router = useRouter();
  const userId = useSelector((state) => state.user._id);
  const [isanyChange, setisanyChange] = useState(false);

  const fetchTodoData = async () => {
    try {
      setisloading(true);
      const response = await axios.get(
        `/api/teams/${teamId}/projects/${projectid}/todos/${todoId}`
      );
      settododata(response.data.data.todo);
      setteammembers(response.data.data.members);
      setisAdmin(response.data.data.isAdmin);
    } catch (error) {
      console.error("Error fetching todo data:", error);
      seterror(error.response?.data?.message || "Something went wrong !");
    } finally {
      setisloading(false);
    }
  };

  useEffect(() => {
    if (todoId && projectid && teamId) {
      fetchTodoData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todoId, projectid, teamId, isanyChange]);

  const handleTodoUpdate = async (updatedData) => {
    try {
      const response = await axios.patch(
        `/api/teams/${teamId}/projects/${projectid}/todos/${todoId}`,
        updatedData
      );
      toast.success(response.data.message || "Todo is Updated Successfully");
      fetchTodoData();
    } catch (error) {
      console.log(" the error in updating todo ", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleTodoDelete = async () => {
    try {
      const response = await axios.delete(
        `/api/teams/${teamId}/projects/${projectid}/todos/${todoId}`
      );
      toast.success(response.data.message || "Todo is deleted Successfully");
      router.push(`/teams/${teamId}/${projectid}`);
    } catch (error) {
      console.log(" the error in updating todo ", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleSubtaskAdd = async (subtaskData) => {
    try {
      setisSubmitting(true);
      const response = await axios.post(
        `/api/teams/${teamId}/projects/${projectid}/todos/${todoId}`,
        subtaskData
      );
      toast.success(response.data.message || "Subtask is added Successfully");
      setIsAddingSubtask(false);
      fetchTodoData();
    } catch (err) {
      console.error("Error adding subtask:", err);
    } finally {
      setisSubmitting(false);
      setIsAddingSubtask(false);
    }
  };

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
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-600 text-xl font-semibold">Error</h2>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Back to Project
          </button>
        </div>
      </div>
    );
  }

  if (!tododata) {
    return (
      <div className="bg-gray-900 flex items-center justify-center h-screen">
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h2 className="text-yellow-600 text-xl font-semibold">
            Task Not Found
          </h2>
          <p className="text-yellow-700">
            The requested task could not be found.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Back to Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 ">
      <div className=" mx-auto p-6 bg-gray-900 min-h-screen">
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>←</span> Back to Project
          </button>
        </div>
        <TodoDetailView
          todo={tododata}
          isAdmin={isAdmin}
          teammembers={teammembers}
          userId={userId}
          onUpdate={handleTodoUpdate}
          onDelete={handleTodoDelete}
        />
        <div className="mt-8 bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Subtasks</h3>
            {tododata.assignedTo._id === userId && (
              <button
                onClick={() => setIsAddingSubtask(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Subtask
              </button>
            )}
          </div>
          {isAddingSubtask && (
            <div className=" w-full h-screen top-0 left-0 fixed bg-gray-400/10  z-50 flex items-center justify-center">
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <AddSubtaskForm
                  onSubmit={handleSubtaskAdd}
                  onCancel={() => setIsAddingSubtask(false)}
                  isSubmitting={isSubmitting}
                  todoId={todoId}
                />
              </div>
            </div>
          )}

          <SubtaskList
            subtasks={tododata.subtasks || []}
            projectId={projectid}
            todoId={todoId}
            userId={userId}
            teamId={teamId}
            setisanyChange={setisanyChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;

const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);
