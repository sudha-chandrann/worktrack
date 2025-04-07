'use client';
import React, { useState } from "react";
import {  ShieldIcon, CalendarIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";

function MemberCard({ member, isAdmin,teamId ,setisEditing}) {
  const { user, role, joinedAt } = member;
  const [isloading ,setisloading]=useState(false);
  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "text-red-400";
      case "member":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const changeRole = async ()=>{
    try{
    setisloading(true);
     const response= await axios.post(`/api/teams/${teamId}/changerole`,{
        userId:user._id,
        newRole:role === "admin"?"member":"admin"
     })
     toast.success(response.data.message||"Role changed successfully");
     setisEditing((prev)=>!prev)
    }
    catch(error){
      toast.error(error?.response?.data?.message||"Failed to change role");
      console.log(" the error is ",error)
    }
    finally{
        setisloading(false);
    }
  }

  const removeMember = async ()=>{
    try{
    setisloading(true);
     const response= await axios.patch(`/api/teams/${teamId}/changerole`,{
        userId:user._id,
     })
     toast.success(response.data.message||"member is removed  successfully");
     setisEditing((prev)=>!prev)
    }
    catch(error){
      toast.error(error?.response?.data?.message||"Failed to remove the member");
      console.log(" the error is ",error)
    }
    finally{
        setisloading(false);
    }
  }

  if(isloading){
    <div className="bg-gray-800 rounded-lg w-full p-4 shadow-md flex items-center ">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-700 border-t-blue-500"></div>
    </div>
  }
  
  return (
    <div className="bg-gray-800 rounded-lg w-full p-4 shadow-md flex items-center flex-wrap hover:bg-gray-750 transition-colors">
      <div className="flex-shrink-0 mr-4">
        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium">
          {getInitials(user?.fullName)}
        </div>
      </div>

      <div className="flex-grow">
        <div className="flex items-center">
          <h3 className="text-white font-medium">{user?.fullName}</h3>
          <div
            className={`ml-2 text-sm font-semibold ${getRoleColor(
              role
            )} flex items-center`}
          >
            <ShieldIcon className="h-3 w-3 mr-1" />
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </div>
        </div>

        <div className="text-gray-400 text-sm">
          {user?.username ? `@${user.username}` : user?.email}
        </div>
        <div className="text-gray-400 text-sm">
          {user?.email}
        </div>

        <div className="text-gray-500 text-xs mt-1 flex items-center">
          <CalendarIcon className="h-3 w-3 mr-1" />
          Joined {formatDate(joinedAt)}
        </div>
      </div>
      {isAdmin && (
        <div className="flex-shrink-0 flex flex-col items-center gap-2 ml-auto">
          <button className="text-gray-400 hover:text-white px-3 py-1 rounded border border-gray-600 hover:border-gray-500 text-sm transition-colors" onClick={changeRole}>
            {role === "admin" ? "Remove Admin" : "Make Admin"}
          </button>
          <button className="text-gray-400 hover:text-white px-3 py-1 rounded border border-gray-600 hover:border-gray-500 text-sm transition-colors flex items-center justify-center" onClick={removeMember}>
           Remove Member
          </button>
        </div>
      )}
    </div>
  );
}

export default MemberCard;
