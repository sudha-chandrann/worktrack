import mongoose from "mongoose";
import dbConnect from "../../../../../../lib/dbconnect";
import { Project, Subtask, Team,Todo ,Comment} from "../../../../../../models/user.model";
import { getDataFromToken } from "../../../../../../utils/getdatafromtoken";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    await dbConnect();
    const id = getDataFromToken(req);
    const { params } = context;
    const projectId = params.projectId;
    const teamId = params.teamId;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    if (
      !mongoose.Types.ObjectId.isValid(projectId) ||
      !mongoose.Types.ObjectId.isValid(teamId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid Project ID and Team Id" },
        { status: 400 }
      );
    }
    const  team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team is not found" },
        { status: 400 }
      )
    }
    const project = await Project.findById(projectId)
      .populate({
        path: "todos",
        select:
          "title description status priority _id dueDate completedAt tags project",
        populate:  [
          { path: "assignedTo", select: "username email fullName" },
          { path: "assignedBy", select: "username email fullName" }
        ]
      })
      .populate({
        path: "members",
        populate: {
          path: "user",
          select: "username email fullName",
        },
        select: "user role",
      })
      .populate("createdBy", "username fullName")


    const isMember = team.members.find(
      (member) => member.user.toString() === id.toString()
    );

    if(!isMember){
      return NextResponse.json(
        { success: false, message: "You are not a member of this team" },
        { status: 403 }
      )
    }
    const isAdmin=isMember.role==="admin"


    return NextResponse.json(
      { success: true, data: {
        project:project,
        isAdmin:isAdmin,
      }, message: " todos found" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/users/getalltodos:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  try {
    await dbConnect();
    const id = getDataFromToken(req);
    const { params } = context;
    const projectId = params.projectId;
    const teamId = params.teamId;

    // Check authentication
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(projectId) ||
      !mongoose.Types.ObjectId.isValid(teamId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid Project ID or Team ID" },
        { status: 400 }
      );
    }

    // Find team and check if user is a member
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    // Check if user is a team member
    const teamMember = team.members.find(
      (member) => member.user.toString() === id.toString()
    );
    if (!teamMember) {
      return NextResponse.json(
        { success: false, message: "You are not a member of this team" },
        { status: 403 }
      );
    }

    // Check if user is an admin (only admins can delete projects)
    if (teamMember.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only team admins can delete projects" },
        { status: 403 }
      );
    }

    // Find project
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    // Check if project belongs to the team
    if (project.team.toString() !== teamId) {
      return NextResponse.json(
        { success: false, message: "Project does not belong to this team" },
        { status: 400 }
      );
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Get all todos in this project
      const todos = await Todo.find({ project: projectId });
      const todoIds = todos.map(todo => todo._id);
      
      // Find all subtasks belonging to these todos
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
      await Todo.deleteMany({ project: projectId }, { session });
      
      // Remove project reference from the team
      await Team.findByIdAndUpdate(
        teamId,
        { $pull: { projects: projectId } },
        { session }
      );
      
      // Finally delete the project
      await Project.findByIdAndDelete(projectId, { session });
      
      // Commit the transaction
      await session.commitTransaction();
      
      return NextResponse.json(
        { 
          success: true, 
          message: "Project and all associated data deleted successfully" 
        },
        { status: 200 }
      );
    } catch (error) {
      // If anything fails, abort the transaction
      await session.abortTransaction();
      throw error;
    } finally {
      // End the session
      session.endSession();
    }
    
  } catch (error) {
    console.error("Error in DELETE /api/teams/[teamId]/projects/[projectId]:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function POST(req, context) {
  await dbConnect();

  try {
    const id = getDataFromToken(req);
    const { title, description, priority, dueDate, tags,assignedTo } = await req.json();
    const { params } = context;
    const projectId = params.projectId;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json(
        {
          data: null,
          error: "Invalid or missing Project ID",
          success: false,
        },
        {
          status: 400, // Bad Request
        }
      );
    }
    const project = await Project.findById(projectId);
    if (!project) {
        return NextResponse.json(
            {
                data: null,
                message: "Project not found",
                success: false,
            },
            {
                status: 404,
            }
        )
    }

    if ([title, description, priority, dueDate,assignedTo].some((field) => !field)) {
      return NextResponse.json(
        {
          data: null,
          error: "all fields are required",
          success: false,
        },
        {
          status: 404,
        }
      );
    }

    const newTodo = await Todo.create({
      title,
      description,
      priority: priority || "medium",
      dueDate: dueDate || null,
      tags: tags || [],
      project: project._id,
      assignedTo: assignedTo,
      assignedBy: id,
      status: "to-do",
    });

    await Project.findByIdAndUpdate(projectId, {
      $push: { todos: newTodo._id },
    });

    return NextResponse.json(
      {
        success:true,
        message:"new Todo is Created successfully",
        data:newTodo
      },
      {
        status:200
      }
    );
  } catch (error) {
    console.error('Error creating  todo:', error);
    return NextResponse.json({
      success: false,
      message: error.message||'Internal server error',
      data: null
    },
    {
        status:500
    }
);
  }
}