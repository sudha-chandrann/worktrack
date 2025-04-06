"use client";

import React from "react";
import SidebarItem from "./SidebarItem";
import { Inbox, Calendar, Clock, Filter, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import SideBarProjectItem from "./SideBarProjectItem";
import SideBarTeamItem from "./SideBarTeamItem";

const DashboardRoutes = [
  {
    icon: Inbox,
    label: "Inbox",
    href: "/dashboard/inbox",
  },
  {
    icon: Calendar,
    label: "Today",
    href: "/dashboard/today",
  },
  {
    icon: Clock,
    label: "Upcoming",
    href: "/dashboard/upcoming",
  },
  {
    icon: Filter,
    label: "Filters",
    href: "/dashboard/filters",
  },
];

function Sidebar() {
  const router = useRouter();
  const projects = useSelector((state) => state.user.projects);
  const teams=useSelector((state)=>state.user.teams);
  return (
    <div className="w-full h-full overflow-y-auto bg-gray-900 text-gray-300 border-r border-gray-800">
      <div className="flex items-center gap-3 px-6 py-8">
        <Image
          src={"/logo.svg"}
          alt="logo"
          height={40}
          width={40}
          className="brightness-200"
        />
        <span className="text-xl font-semibold text-white tracking-wide">
          WorkTrack
        </span>
      </div>

      <div className="mt-2 space-y-1 px-3">
        <h2 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-2 px-4">
          Dashboard
        </h2>

        {DashboardRoutes.map((route) => (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
          />
        ))}
      </div>

      <div className="mt-2 space-y-1 px-3">
        <div className="w-full items-center flex justify-between  px-6 py-3 border-b">
          <h2 className="text-sm uppercase font-bold tracking-wider text-gray-500">
            Projects
          </h2>
          <button
            onClick={() => router.push("/dashboard/create")}
            className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
            aria-label="Create new project"
            title="Create new project"
          >
            <PlusIcon className="h-5 w-5 stroke-2" />
          </button>
        </div>
        {projects.length > 0 &&
          projects.map((project) => (
            <SideBarProjectItem
              key={project._id}
              icon={project.icon}
              label={project.name}
              href={project._id}
            />
          ))}

        {/* Project list would go here */}
        <div className="w-full items-center flex justify-between  px-6 py-3 border-b">
          <h2 className="text-sm uppercase font-bold tracking-wider text-gray-500">
            Teams
          </h2>
          <button
            onClick={() => router.push("/dashboard/createteam")}
            className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
            aria-label="Create new Team"
            title="Create new Team"
          >
            <PlusIcon className="h-5 w-5 stroke-2" />
          </button>
        </div>
        {teams.length > 0 &&
          teams.map((team) => (
            <SideBarTeamItem
              key={team._id}
              label={team.name}
              href={team._id}
            />
          ))}
      </div>
    </div>
  );
}

export default Sidebar;
