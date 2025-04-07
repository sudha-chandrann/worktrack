
import mongoose from "mongoose";
import dbConnect from "../../../../lib/dbconnect";
import { Comment, Project, Subtask, Team, Todo, User } from "../../../../models/user.model"
import { getDataFromToken } from "../../../../utils/getdatafromtoken"
import { NextResponse } from "next/server";

export async function GET(req, context) {
    try {
      await dbConnect();
      
      // Authenticate user
      const userId = getDataFromToken(req);
      if (!userId) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Authentication failed. Please log in.",
            data: null 
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
  
      // Find team and populate member and creator details
      const team = await Team.findById(teamId)
        .populate({
          path: "members.user",
          select: "username email fullName " // Include relevant user fields
        })
        .populate({
          path: "createdBy",
          select: "username email fullName "
        })
        .populate({
          path: "projects",
          select: "name description icon color createdBy",
          populate: {
            path: "createdBy",
            select: "username email fullName"
          }
        });
        
      if (!team) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Team not found",
            data: null 
          }, 
          { status: 404 }
        );
      }
      
      // Check if the requesting user is a member of this team
      const userMember = team.members.find(member => 
        member.user._id.toString() === userId.toString()
      );
      
      if (!userMember) {
        return NextResponse.json(
          { 
            success: false, 
            message: "You don't have permission to view this team",
            data: null 
          }, 
          { status: 403 }
        );
      }
  
      const isAdmin = userMember && userMember.role === "admin";

  
      return NextResponse.json(
        { 
          success: true, 
          message: "Team details retrieved successfully",
          data: {
            team: team,
            isAdmin: isAdmin
          }
        }, 
        { status: 200 }
      );
      
    } catch (error) {
      console.error("Error getting team details:", error);
      return NextResponse.json(
        { 
          success: false, 
          message: error.message||"Failed to retrieve team details",
          data: null 
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
          data: null 
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

    // Find team
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Team not found",
          data: null 
        }, 
        { status: 404 }
      );
    }
    
    // Check if the requesting user is an admin of this team
    const userMember = team.members.find(member => 
      member.user.toString() === userId.toString() && member.role === "admin"
    );
    
    if (!userMember) {
      return NextResponse.json(
        { 
          success: false, 
          message: "You don't have permission to delete this team. Only admins can delete teams.",
          data: null 
        }, 
        { status: 403 }
      );
    }


    // Begin transaction for data consistency
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Get all projects in the team
      const projectIds = team.projects;
      
      // 2. Get all todos in these projects
      const todos = await Todo.find({ project: { $in: projectIds } });
      const todoIds = todos.map(todo => todo._id);
      
      // 3. Get all subtasks in these todos
      const subtasks = await Subtask.find({ parentTask: { $in: todoIds } });
      const subtaskIds = subtasks.map(subtask => subtask._id);
      
      // 4. Delete all comments on todos and subtasks
      await Comment.deleteMany({ 
        $or: [
          { taskRef: { $in: todoIds }, onModel: 'Todo' },
          { taskRef: { $in: subtaskIds }, onModel: 'Subtask' }
        ]
      }, { session });
      
      // 5. Delete all subtasks
      await Subtask.deleteMany({ parentTask: { $in: todoIds } }, { session });
      
      // 6. Delete all todos
      await Todo.deleteMany({ project: { $in: projectIds } }, { session });
      
      // 7. Delete all projects
      await Project.deleteMany({ _id: { $in: projectIds } }, { session });
      
      // 8. Remove team from all member profiles
      const memberIds = team.members.map(member => member.user);
      await User.updateMany(
        { _id: { $in: memberIds } },
        { $pull: { teams: teamId } },
        { session }
      );
      
      // 9. Finally delete the team
      await Team.findByIdAndDelete(teamId, { session });
      
      // Commit transaction
      await session.commitTransaction();
      
      return NextResponse.json(
        { 
          success: true, 
          message: "Team and all associated data deleted successfully",
          data: null
        }, 
        { status: 200 }
      );
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      throw error;
    } finally {
      // End session
      session.endSession();
    }
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to delete team",
        data: null 
      }, 
      { status: 500 }
    );
  }
}

