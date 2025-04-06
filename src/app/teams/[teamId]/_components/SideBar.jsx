'use client';

import React, { useState } from "react";
import { ArrowLeft, PlusIcon } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Link from "next/link";
import SideBarItem from "./SideBarItem";
import AddProjectModal from "./AddProjectModal";

function Sidebar({ team, isAdmin, setfetchdataagain }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!team) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-400">
        Loading sidebar...
      </div>
    );
  }

  const handleAddProject = async (projectData) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(`/api/teams/${team._id}/projects`, projectData);
      
      toast.success(
        response.data.message || "Project created successfully"
      );
      
      setIsModalOpen(false);
      setfetchdataagain((prev) => !prev);
    } catch (err) {
      toast.error(
        err.response?.data.message || "Failed to create project. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside className="w-full h-full overflow-y-auto bg-gray-900 text-gray-300 border-r border-gray-800 flex flex-col">
      {/* Back to teams navigation */}
      <Link 
        href={`/dashboard/teams/${team._id} `}
        className="flex items-center gap-2 px-6 py-4 hover:bg-gray-800 transition-colors"
      >
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Back to Teams</span>
      </Link>
      
      {/* Team header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
          {team.name?.charAt(0)?.toUpperCase() || "T"}
        </div>
        <span className="text-lg font-semibold text-white tracking-tight">
          {team.name}
        </span>
      </div>

      {/* Projects section */}
      <div className="mt-4 flex-1">
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
          <h2 className="text-xs uppercase font-bold tracking-wider text-gray-500">
            Projects
          </h2>
          
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              aria-label="Create new project"
              title="Create new project"
            >
              <PlusIcon className="h-4 w-4 stroke-2" />
            </button>
          )}
        </div>
        
        {/* Project list */}
        <div className="mt-2 space-y-1 px-3">
          {team.projects && team.projects.length > 0 ? (
            team.projects.map((project) => (
              <SideBarItem
                key={project._id}
                icon={project.icon}
                label={project.name}
                href={`/teams/${team._id}/${project._id}`}
              />
            ))
          ) : (
            <div className="text-center py-6 text-sm text-gray-500">
              {isAdmin ? "Add your first project" : "No projects available"}
            </div>
          )}
        </div>
      </div>
      
      {/* Team information footer */}
      <div className="mt-auto px-6 py-4 border-t border-gray-800">
        <div className="text-xs text-gray-500">
          Team ID: <span className="font-mono">{team._id}</span>
        </div>
      </div>

      {/* Project creation modal */}
      {isModalOpen && (
        <AddProjectModal
          onSubmit={handleAddProject}
          onclose={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </aside>
  );
}

export default Sidebar;