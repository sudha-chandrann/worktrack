'use client';

import { useRouter } from "next/navigation";

const ProjectCard = ({ project, teamId }) => {
  const router = useRouter();

  const viewProject = () => {
    router.push(`/teams/${teamId}/${project._id}`);
  };
  
  return (
    <div className="w-full p-6 shadow-lg rounded-xl bg-gray-800 border border-gray-700 transition-all hover:shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="flex items-center justify-center h-10 w-10 rounded-lg text-xl" 
            style={{ backgroundColor: project.color + '20', color: project.color }}
          >
            {project.icon}
          </div>
          <h3 className="text-xl font-semibold text-white tracking-tight">
            {project.name}
          </h3>
        </div>
        
        <button
          className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium flex items-center justify-center"
          onClick={viewProject}
          aria-label={`View ${project.name} details`}
        >
          View Project
        </button>
      </div>
      
      <div className="space-y-3">
        <p className="text-gray-300 text-sm leading-relaxed">
          {project.description}
        </p>
        
        <div className="flex items-center pt-2 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            Created by <span className="font-medium text-gray-300">{project.createdBy.fullName}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;