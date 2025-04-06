"use client";

import React from "react";
import { Menu, Bell } from "lucide-react";
import Sidebar from "./SideBar"
import { Sheet, SheetContent, SheetTrigger } from "../../../components/ui/sheet"
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

function Navbar() {
  const username = useSelector((state) => state.user.username);
  const router= useRouter();
  return (
    <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        <div className="md:hidden mr-4">
          <Sheet>
            <SheetTrigger className="p-2 text-gray-400 hover:text-gray-200 rounded-md hover:bg-gray-800 transition-colors">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-gray-900 border-r border-gray-800">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>
      
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-gray-200 rounded-md hover:bg-gray-800 transition-colors relative" onClick={()=>{router.push('/dashboard/notification')}}>
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>
        </button>
        
        <Avatar name={username} />
      </div>
    </div>
  );
}

export default Navbar;