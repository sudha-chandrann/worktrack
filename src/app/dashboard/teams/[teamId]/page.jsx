"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AlertCircle, Plus, UserPlus, Users } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../../../../components/ui/button";
import MemberCard from "../_components/MemberCard";
import AddMemberModal from "../_components/AddMemberModal";
import AddProjectModal from "../_components/AddProjectModal";
import ProjectCard from "../_components/ProjectCard";

function Page({ params }) {
  const { teamId } = params;
  const [isLoading, setIsLoading] = useState(false);
  const [team, setteam] = useState({});
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);
  const [isEditing, setisEditing] = useState(false);
  const fetchTeamData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/teams/${teamId}`);
      setteam(response.data.data.team);
      setIsAdmin(response.data.data.isAdmin);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = async (projectData) => {
    try {
      setisSubmitting(true);
      const response = await axios.post(
        `/api/teams/${teamId}/projects`,
        projectData
      );
      toast.success(
        response.data.message || " new Project is Created Successfully"
      );
      fetchTeamData();
      setAddProjectModalOpen(false);
    } catch (err) {
      
      toast.error(err.message || "Something went wrong!");
      console.log(" the error during creating project is ",err)
    } finally {
      setisSubmitting(false);
    }
  };

  useEffect(() => {
    if (teamId) {
      fetchTeamData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, isEditing]);

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
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="bg-gray-900 flex items-center justify-center h-screen">
        <div className="p-6 bg-gray-800 border border-yellow-500 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-yellow-500" size={24} />
            <h2 className="text-yellow-400 text-xl font-semibold">
              Team Not Found
            </h2>
          </div>
          <p className="text-gray-300 mb-4">
            The requested Team could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen min-w-fit">
      <div className="max-w-6xl  mx-auto p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2 py-2">
          <div className=" flex flex-col gap-2">
            <div className=" flex items-center gap-2 text-white">
              <Users />
              <h1 className="text-2xl font-bold ">{team.name}</h1>
            </div>
            <p className="text-gray-500">{team.description}</p>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setAddMemberModalOpen(true)}
                className="flex items-center gap-2"
              >
                <UserPlus size={16} />
                Add Member
              </Button>
              <Button
                onClick={() => setAddProjectModalOpen(true)}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800"
              >
                <Plus size={16} />
                New Project
              </Button>
            </div>
          )}
        </div>
        <div className=" w-full">
          <p className="text-white mb-4">Members</p>
          <div className="flex flex-col gap-4">
            {team?.members?.length > 0 ? (
              team.members.map((member) => (
                <MemberCard
                  key={member._id}
                  member={member}
                  isAdmin={isAdmin}
                  teamId={teamId}
                  setisEditing={setisEditing}
                />
              ))
            ) : (
              <p className="text-gray-400">No members found.</p>
            )}
          </div>
        </div>
        <div className=" w-full mt-5">
          <p className="text-white mb-4">Projects</p>
          <div className="flex flex-col gap-4">
          {team?.projects?.length > 0 ? (
              team.projects.map((project) => (
                <ProjectCard key={project._id} project={project} teamId={teamId}/>
              ))
            ) : (
              <p className="text-gray-400 text-center mt-6 ">
                No Projects found.
              </p>
            )}
          </div>
        </div>
        {addMemberModalOpen && (
          <AddMemberModal
            isOpen={addMemberModalOpen}
            onClose={() => setAddMemberModalOpen(false)}
            teamId={teamId}
          />
        )}

        {addProjectModalOpen && (
          <AddProjectModal
            onSubmit={handleAddProject}
            onclose={() => setAddProjectModalOpen(false)}
            isSubmitting={isSubmitting}
          />
        )}
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
