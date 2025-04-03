"use client";

import React from "react";
import { Menu } from "lucide-react";
import Sidebar from "./SideBar";
import { Sheet, SheetContent, SheetTrigger } from "../../../../components/ui/sheet"


function Navbar({team,isAdmin}) {
  return (
    <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        <div className="md:hidden mr-4">
          <Sheet>
            <SheetTrigger className="p-2 text-gray-400 hover:text-gray-200 rounded-md hover:bg-gray-800 transition-colors">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-gray-900 border-r border-gray-800"   >
              <Sidebar team={team} isAdmin={isAdmin}/>
            </SheetContent>
          </Sheet>
        </div>
      
      </div>
      

    </div>
  );
}

export default Navbar;