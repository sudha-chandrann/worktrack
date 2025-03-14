"use client";

import React from "react";
import SidebarItem from "./SideBarItem";
import { Inbox, Calendar, Clock, Filter } from "lucide-react";
import Image from "next/image";

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
  return (
    <div className="w-full h-full overflow-y-auto bg-gray-900 text-gray-300 border-r border-gray-800">
      <div className="flex items-center gap-3 px-6 py-8">
        <Image src={'/logo.svg'} alt="logo" height={40} width={40} className="brightness-200" />
        <span className="text-xl font-semibold text-white tracking-wide">WorkTrack</span>
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
      
      <div className="mt-8 space-y-1 px-3">
        <h2 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-2 px-4">
          Projects
        </h2>
        {/* Project list would go here */}
      </div>
    </div>
  );
}

export default Sidebar;