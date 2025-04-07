"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import SubTaskDetailView from "./_components/SubTaskDetailView";
import CommentView from "./_components/CommentView";

function Page({ params }) {
  const { projectid, todoId, subtodoId, teamId } = params;
  const [subtaskdata, setsubtaskdata] = useState(null);
  const [isLoading, setisloading] = useState(false);
  const [error, seterror] = useState(null);
  const router = useRouter();
  const userId = useSelector((state)=>state.user._id);
  const fetchTodoData = async () => {
    try {
      setisloading(true);
      const response = await axios.get(
        `/api/teams/${teamId}/projects/${projectid}/todos/${todoId}/${subtodoId}`,
      );
      setsubtaskdata(response.data.data);
    } catch (error) {
      console.error("Error fetching subtask data:", error);
      seterror(error.response?.data?.message || "Something went wrong !");
    } finally {
      setisloading(false);
    }
  };
  useEffect(() => {
    if (todoId && projectid && subtodoId) {
      fetchTodoData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todoId, projectid, subtodoId]);

  const handleSubtaskUpdate = async (updatedData) => {
    try {
      const response = await axios.patch(
        `/api/teams/${teamId}/projects/${projectid}/todos/${todoId}/${subtodoId}`,
        updatedData
      );
      toast.success(response.data.message || "Todo is Updated Successfully");
      fetchTodoData();
    } catch (error) {
      console.log(" the error in updating todo ", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  const handleSubtaskDelete = async () => {
    try {
      const response = await axios.delete(
        `/api/teams/${teamId}/projects/${projectid}/todos/${todoId}/${subtodoId}`,
      );
      toast.success(response.data.message || "Todo is deleted Successfully");
      router.back();
    } catch (error) {
      console.log(" the error in updating todo ", error);
      toast.error(error.response?.data?.message || "Something went wrong");
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
            Back to Todo
          </button>
        </div>
      </div>
    );
  }
  if (!subtaskdata) {
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
            Back to Todo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900">
            <div className="mx-auto p-6 bg-gray-900 min-h-screen">
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>←</span> Back to Todo
          </button>
        </div>
        <SubTaskDetailView
          subtask={subtaskdata}
          onUpdate={handleSubtaskUpdate}
          onDelete={handleSubtaskDelete}
          userId={userId}
        />
                  <CommentView comments={subtaskdata.comments || []} userId={userId} subtodoId={subtodoId} teamId={teamId}/>

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
