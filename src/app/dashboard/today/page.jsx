"use client";

import axios from "axios";
import { Calendar, CheckCircle2, Circle, Clock, PlusCircle, XOctagon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import TodoTimer from "./_components/TodoTimer";
import DailyCountdownTimer from "./_components/TodoTimer";

function Page() {
  const [todosData, setTodosData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    const fetchTodayTodos = async () => {
      try {
        const response = await axios.get("/api/users/gettodaytodos");
        setTodosData(response.data.data || []);
      } catch (err) {
        setError("Failed to load tasks. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayTodos();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 bg-gray-900 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!todosData.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 bg-gray-900">
        <Calendar className="h-16 w-16 text-gray-400" />
        <h3 className="mt-4 text-xl font-semibold text-white">No tasks for today</h3>
        <p className="mt-2 text-center text-gray-600">
          You don&apos;t have any tasks due today. Enjoy your day!
        </p>
      </div>
    );
  }

  const todoCountByStatus = todosData.reduce((acc, todo) => {
    acc[todo.status] = (acc[todo.status] || 0) + 1;
    return acc;
  }, {});

  const handleTimerComplete = async () => {
    if (todosData[0]) {
    //   await handleStatusChange(todosData[0]._id, "completed");
    }
    setShowTimer(false);
  };
  
  const cancelTimer = () => {
    setShowTimer(false);
  };



  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-900 ">
    
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-800 p-6 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="w-1/2">
            <h1 className="text-2xl font-bold text-white">Today&apos;s Tasks</h1>
            <p className="mt-1 text-gray-300">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>

          {/* Task summary */}
          <div className="flex items-center space-x-4 text-gray-300 flex-wrap">
            <div className="flex items-center space-x-2">
              <Circle className="h-4 w-4 text-blue-500" />
              <span>To-do: {todoCountByStatus["to-do"] || 0}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span>In progress: {todoCountByStatus["in-progress"] || 0}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Completed: {todoCountByStatus["completed"] || 0}</span>
            </div>
            <div className="flex items-center space-x-2">
              <XOctagon className="h-4 w-4 text-red-500" />
              <span>Blocked: {todoCountByStatus["blocked"] || 0}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center px-3 pt-2">
        <div className="flex ga-2 items-center">
          <PlusCircle/>
        </div>
      <div className="ml-auto ">
       <DailyCountdownTimer/>
     </div>
      </div>
     
 
      


    </div>
  );
}

export default Page;