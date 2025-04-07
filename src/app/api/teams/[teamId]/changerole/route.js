import mongoose from "mongoose";
import dbConnect from "../../../../../lib/dbconnect";
import { Team ,User,Project, Todo, Subtask, Comment} from "../../../../../models/user.model";
import { getDataFromToken } from "../../../../../utils/getdatafromtoken";
import { NextResponse } from "next/server";

export async function POST(req, context) {
  try {
    await dbConnect();
    
    // Verify authentication
    const id = getDataFromToken(req);
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication failed. Please log in.",
          data: null,
        },
        { status: 401 }
      );
    }
    
    // Get and validate team ID from route parameters
    const { params } = context;
    const teamId = params.teamId;
    
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid team ID format",
          data: null 
        }, 
        { status: 400 }
      );
    }
    
    // Parse request body
    const requestBody = await req.json();
    const { userId, newRole } = requestBody;
    
    if (!userId || !newRole) {
      return NextResponse.json(
        { success: false, message: "User ID and new role are required", data: null },
        { status: 400 }
      );
    }
    
    // Validate role value
    if (!["admin", "member"].includes(newRole)) {
      return NextResponse.json(
        { success: false, message: "Invalid role. Role must be 'admin' or 'member'", data: null },
        { status: 400 }
      );
    }
    
    // Find the team
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found", data: null },
        { status: 404 }
      );
    }
    
    // Check if the current user has admin permission
    const currentUserMembership = team.members.find(
      (member) => member.user.toString() === id.toString()
    );
    
    if (!currentUserMembership || currentUserMembership.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "You don't have permission to update roles",
          data: null,
        },
        { status: 403 }
      );
    }
    
    // Find the team member to update
    const memberToUpdate = team.members.find(
      (member) => member.user.toString() === userId.toString()
    );
    
    if (!memberToUpdate) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not a member of this team",
          data: null,
        },
        { status: 409 }
      );
    }
    
    // Count admins in the team
    const adminCount = team.members.filter(
      (member) => member.role === "admin"
    ).length;
    
    // Prevent removing the last admin
    if (newRole === "member" && memberToUpdate.role === "admin" && adminCount === 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot remove the last admin from team",
          data: null,
        },
        { status: 400 }
      );
    }
    
    // Update the role of the user
    memberToUpdate.role = newRole;
    await team.save(); // Save the updated team document
    
    return NextResponse.json(
      {
        success: true,
        message: `User role updated to ${newRole} successfully`,
        data: { userId, newRole },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating team member role:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req, context) {
  try {
    await dbConnect();
    
    // Verify authentication
    const id = getDataFromToken(req);
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication failed. Please log in.",
          data: null,
        },
        { status: 401 }
      );
    }
    
    // Get and validate team ID from route parameters
    const { params } = context;
    const teamId = params.teamId;
    
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid team ID format",
          data: null 
        }, 
        { status: 400 }
      );
    }
    
    // Parse request body
    const requestBody = await req.json();
    const { userId } = requestBody;
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Valid user ID is required", data: null },
        { status: 400 }
      );
    }
    
        
    // Find the team
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found", data: null },
        { status: 404 }
      );
    }
    
    // Check if the current user has admin permission
    const currentUserMembership = team.members.find(
      (member) => member.user.toString() === id.toString()
    );
    
    if (!currentUserMembership || currentUserMembership.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "You don't have permission to remove members",
          data: null,
        },
        { status: 403 }
      );
    }
    
    // Check if user is trying to remove themselves and they're the last admin
    if (userId === id) {
      const adminCount = team.members.filter(
        (member) => member.role === "admin"
      ).length;
      
      if (adminCount === 1) {
        return NextResponse.json(
          {
            success: false,
            message: "Cannot remove yourself as the last admin. Transfer admin role to another member first.",
            data: null,
          },
          { status: 400 }
        );
      }
    }
    
    // Find the index of the user to be removed
    const memberIndex = team.members.findIndex(
      (member) => member.user.toString() === userId.toString()
    );
    
    if (memberIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not a member of this team",
          data: null,
        },
        { status: 409 }
      );
    }
    
    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Remove the user from the team's members list
      team.members.splice(memberIndex, 1);
      await team.save({ session });
      
      // Find and update all team projects to remove the user
      if (team.projects && team.projects.length > 0) {
        await Project.updateMany(
          { _id: { $in: team.projects } },
          { $pull: { members: { user: userId } } },
          { session }
        );
      }
      
      // Remove the team from the user's teams list
      await User.findByIdAndUpdate(
        userId,
        { $pull: { teams: teamId } },
        { session }
      );
      
      // If this was the last member, delete the team and all associated data
      if (team.members.length === 0) {
        // Get all projects in the team
        const projectIds = team.projects;
        
        // Get all todos in these projects
        const todos = await Todo.find({ project: { $in: projectIds } });
        const todoIds = todos.map(todo => todo._id);
        
        // Get all subtasks in these todos
        const subtasks = await Subtask.find({ parentTask: { $in: todoIds } });
        const subtaskIds = subtasks.map(subtask => subtask._id);
        
        // Delete all comments on todos and subtasks
        await Comment.deleteMany({ 
          $or: [
            { taskRef: { $in: todoIds }, onModel: 'Todo' },
            { taskRef: { $in: subtaskIds }, onModel: 'Subtask' }
          ]
        }, { session });
        
        // Delete all subtasks
        await Subtask.deleteMany({ parentTask: { $in: todoIds } }, { session });
        
        // Delete all todos
        await Todo.deleteMany({ project: { $in: projectIds } }, { session });
        
        // Delete all projects
        await Project.deleteMany({ _id: { $in: projectIds } }, { session });
        
        // Finally delete the team
        await Team.findByIdAndDelete(teamId, { session });
        
        await session.commitTransaction();
        session.endSession();
        
        return NextResponse.json(
          { 
            success: true, 
            message: "Last team member removed. Team and all associated data deleted successfully.",
            data: null
          }, 
          { status: 200 }
        );
      }
      
      // Check if no admins remain after removing a member
      const adminCount = team.members.filter(
        (member) => member.role === "admin"
      ).length;
      
      // If no admins left, promote the first remaining member to admin
      if (adminCount === 0 && team.members.length > 0) {
        team.members[0].role = "admin";
        await team.save({ session });
      }
      
      await session.commitTransaction();
      
      return NextResponse.json(
        {
          success: true,
          message: "User removed from the team and all associated projects successfully",
          data: { userId },
        },
        { status: 200 }
      );
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
        data: null,
      },
      { status: 500 }
    );
  }
}