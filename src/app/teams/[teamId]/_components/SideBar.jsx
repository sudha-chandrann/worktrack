"use client";

import React, { useState } from "react";
import {  PlusIcon } from "lucide-react";
import SideBarItem from "./SideBarComponent";




function Sidebar({team,isAdmin}) {
   const [isOpen,setisOpen]=useState(false);

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-900 text-gray-300 border-r border-gray-800">
      <div className="flex items-center gap-3 px-6 py-8">

        <span className="text-xl font-semibold text-white tracking-wide">
          {team.name}
        </span>
      </div>



      <div className="mt-2 space-y-1 px-3">
        <div className="w-full items-center flex justify-between  px-6 py-3 border-b">
          <h2 className="text-sm uppercase font-bold tracking-wider text-gray-500">
            Projects
          </h2>
          {
            isAdmin && (
                <button
                onClick={()=>{setisOpen(true)}}
                className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                aria-label="Create new project"
                title="Create new project"
              >
                <PlusIcon className="h-5 w-5 stroke-2" />
              </button>
            )
          }

        </div>
        {team.projects.length > 0 &&
          team.projects.map((project) => (
            <SideBarItem
              key={project._id}
              icon={project.icon}
              label={project.name}
              href={`${team._id}/${project._id}`}
            />
          ))}



      </div>
    </div>
  );
}

export default Sidebar;
