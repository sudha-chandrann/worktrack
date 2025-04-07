"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TodoDetailView from "./_components/TodoDetailView";
import AddSubtaskForm from "./_components/AddSubtaskForm";
import SubtaskList from "./_components/SubtaskList";
import { ChevronLeft } from "lucide-react";

function Page({ params }) {
  const { ProjectId, todoId } = params;
  const [tododata, settododata] = useState(null);
  const [isLoading, setisloading] = useState(false);
  const [error, seterror] = useState(null);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isEditingSubtask, setIsEditingSubtask] = useState(false);
  const router = useRouter();

  const fetchTodoData = async () => {
    try {
      setisloading(true);
      const response = await axios.get(
        `/api/projects/${ProjectId}/todos/${todoId}`
      );
      settododata(response.data.data);
    } catch (error) {
      console.error("Error fetching todo data:", error);
      seterror(error.response?.data?.message || "Something went wrong !");
    } finally {
      setisloading(false);
    }
  };

  useEffect(() => {
    const fetchTodoData = async () => {
      try {
        setisloading(true);
        const response = await axios.get(
          `/api/projects/${ProjectId}/todos/${todoId}`
        );
        settododata(response.data.data);
      } catch (error) {
        console.error("Error fetching todo data:", error);
        seterror(error.response?.data?.message || "Something went wrong !");
      } finally {
        setisloading(false);
      }
    };
    if (todoId && ProjectId) {
      fetchTodoData();
    }
  }, [todoId, ProjectId,isEditingSubtask]);

  const handleTodoUpdate = async (updatedData) => {
    try {
      const response = await axios.patch(
        `/api/projects/${ProjectId}/todos/${todoId}`,
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
        `/api/projects/${ProjectId}/todos/${todoId}`
      );
      toast.success(response.data.message || "Todo is deleted Successfully");
      router.push(`/dashboard/projects/${ProjectId}`);
    } catch (error) {
      console.log(" the error in updating todo ", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

 const handleSubtaskAdd = async (subtaskData) => {
    try {
     setisSubmitting(false);
      const response = await axios.post(
        `/api/projects/${ProjectId}/todos/${todoId}`,
        subtaskData
      );
      toast.success(response.data.message || "Subtask is added Successfully");
      setIsAddingSubtask(false)
      fetchTodoData();
    } catch (err) {
      console.error("Error adding subtask:", err);
      seterror(err.response?.data?.message || "Something went wrong!");
    }
    finally{
        setisSubmitting(false);
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
            onClick={() => router.push(`/dashboard/projects/${ProjectId}`)}
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
            onClick={() => router.push(`/dashboard/projects/${ProjectId}`)}
            className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Back to Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen pt-[58px]">
    <div className=" mx-auto p-6 bg-gray-900 ">
      <div className="mb-4">
        <button
          onClick={() => router.push(`/dashboard/projects/${ProjectId}`)}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <ChevronLeft size={16} />
           Back to Project
        </button>
      </div>
      <TodoDetailView
        todo={tododata}
        onUpdate={handleTodoUpdate}
        onDelete={handleTodoDelete}
      />
      <div className="mt-8 bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Subtasks</h3>
          <button
            onClick={() => setIsAddingSubtask(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Subtask
          </button>
        </div>
        {isAddingSubtask && (
          <div className=" w-full h-screen top-0 left-0 fixed bg-gray-400/10 flex items-center justify-center">
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
          projectId={ProjectId}
          todoId={todoId}
          setIsEditingSubtask={setIsEditingSubtask}
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
