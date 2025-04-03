'use client';

import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../_components/SideBar";
import Navbar from "../_components/NavBar";

export default function RootLayout({ children, params }) {
  const teamId = params.teamId; // Extract teamId properly from params
  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [fetchdataagain,setfetchdataagain]=useState(false);
  const fetchTeamData = async () => {
    if (!teamId) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/teams/${teamId}`);
      const { team, isAdmin } = response.data.data;
      console.log("the team is ",team);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId,fetchdataagain]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState message={error} retry={fetchTeamData} />;
  }

  return (
    <div className="h-screen flex flex-col">
        <div className="h-[60px] md:pl-56 lg:pl-64 fixed insert-y-0 w-full bg-white z-50">
        <Navbar team={team} isAdmin={isAdmin} setfetchdataagain={setfetchdataagain} />
      </div>
      
      <div className="hidden md:flex w-56 lg:w-64 h-full flex-col fixed insert-y-0 z-50 ">
      <Sidebar team={team} isAdmin={isAdmin} setfetchdataagain={setfetchdataagain} />
      </div>
      
      <div className="md:ml-56 lg:ml-64 mt-[60px] w-full bg-gray-900">{children}</div>

    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="border-t-4 border-blue-600 border-solid rounded-full w-12 h-12 animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading team data...</p>
      </div>
    </div>
  );
}

function ErrorState({ message, retry }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
        <p className="text-gray-600 mb-4">{message}</p>
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