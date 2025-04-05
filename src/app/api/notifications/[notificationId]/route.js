import mongoose from "mongoose";
import dbConnect from "../../../../lib/dbconnect";
import { Notification, Team, User,Project } from "../../../../models/user.model";
import { getDataFromToken } from "../../../../utils/getdatafromtoken";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  try {
    await dbConnect();
    
    // Authenticate user
    const userId = getDataFromToken(req);
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication failed. Please log in.",
          data: null,
        },
        { status: 401 }
      );
    }
    
    const notificationId = context.params.notificationId;
    
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid notification ID format",
          data: null,
        },
        { status: 400 }
      );
    }
    
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true } 
    );
    
    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Notification not found", data: null },
        { status: 404 }
      );
    }
    
    const team = await Team.findById(notification.entityId);
    if (!team) {
      return NextResponse.json(
        {
          success: false,
          message: "Team not found",
          data: null,
        },
        { status: 404 }
      );
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          data: null,
        },
        { status: 404 }
      );
    }
    
    const isAlreadyMember = team.members.some(
      (member) => member.user.toString() === userId
    );
    
    const roleMatch = notification.message.match(/as (\w+)$/);
    const role = roleMatch ? roleMatch[1] : "member";
    
    if (!isAlreadyMember) {
      team.members.push({ user: user._id, role });
      await team.save();
    }
    
    if (!user.teams.includes(team._id)) {
      user.teams.push(team._id);
      await user.save();
    }
    
    if (team.projects && team.projects.length > 0) {
      // Get all team projects
      const teamProjects = await Project.find({ _id: { $in: team.projects } });
      
      const projectUpdatePromises = teamProjects.map(async (project) => {
        const isProjectMember = project.members.some(
          (member) => member.user.toString() === userId
        );
        
        if (!isProjectMember) {
          project.members.push({ user: user._id, role });
          return project.save();
        }
      });
      
      await Promise.all(projectUpdatePromises);
    }
    
    return NextResponse.json(
      {
        success: true,
        message: "User added to the team, all team projects, and notification marked as read",
        data: notification,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating notification and team membership:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update notification and team",
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
    try {
      await dbConnect();
  
      // Authenticate user
      const userId = getDataFromToken(req);
      if (!userId) {
        return NextResponse.json(
          {
            success: false,
            message: "Authentication failed. Please log in.",
            data: null,
          },
          { status: 401 }
        );
      }
  
      // Get and validate notification ID from route parameters
      const notificationId = context.params.notificationId;
  
      if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid notification ID format",
            data: null,
          },
          { status: 400 }
        );
      }
  
      // Find and update notification
      const notification = await Notification.findByIdAndDelete( notificationId );
      if (!notification) {
        return NextResponse.json(
          { success: false, message: "Notification not found", data: null },
          { status: 404 }
        );
      }

  
      return NextResponse.json(
        {
          success: true,
          message: "notification is Deleted successfully",
          data: notification,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting notification :", error);
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Failed to delete notification",
          data: null,
        },
        { status: 500 }
      );
    }
 }
  