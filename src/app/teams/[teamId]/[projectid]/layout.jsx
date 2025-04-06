'use client';

import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { login } from "../../../../store/userSlice"
import Sidebar from "../_components/SideBar";
import Navbar from "../_components/NavBar";

export default function RootLayout({ children, params }) {
  const teamId = params.teamId;
  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [fetchdataagain, setfetchdataagain] = useState(false);
   const router= useRouter();

    const dispatch = useDispatch();
  
    const getCurrentUser = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/users/getcurrentuser");
        if (response.data.success) {
          // User is authenticated, set user data in Redux store
          dispatch(login(response.data.data));
          setIsLoading(false);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.log("Error fetching current user:", error);
        router.push("/login");
      }
    };


  const fetchTeamData = async () => {
    if (!teamId) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/teams/${teamId}`);
      const { team, isAdmin } = response.data.data;
      setTeam(team);
      setIsAdmin(isAdmin);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to load team data";
      setError(errorMessage);
      console.error("Team data fetch error:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
    getCurrentUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, fetchdataagain]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState message={error} retry={fetchTeamData} />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Navbar - fixed at top */}
      <div className="h-[60px] md:pl-56 lg:pl-64 fixed top-0 left-0 right-0 w-full bg-gray-900 z-40 shadow-sm">
        <Navbar team={team} isAdmin={isAdmin} setfetchdataagain={setfetchdataagain} />
      </div>
      
      {/* Sidebar - fixed at left */}
      <div className="hidden md:flex w-56 lg:w-64 h-full flex-col fixed inset-y-0 z-50 border-r border-gray-800">
        <Sidebar team={team} isAdmin={isAdmin} setfetchdataagain={setfetchdataagain} />
      </div>
      
      {/* Main content area */}
      <div className="md:ml-56 lg:ml-64 mt-[60px] flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="border-t-4 border-blue-600 border-solid rounded-full w-12 h-12 animate-spin"></div>
        <p className="mt-4 text-gray-400 font-medium">Loading team data...</p>
      </div>
    </div>
  );
}

function ErrorState({ message, retry }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="max-w-md p-6 bg-gray-800 rounded-lg shadow-md text-center border border-red-500">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-100 mb-2">Something went wrong</h3>
        <p className="text-gray-300 mb-4">{message}</p>
        <button 
          onClick={retry}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}