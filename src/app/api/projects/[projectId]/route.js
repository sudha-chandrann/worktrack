
import mongoose from "mongoose";
import dbConnect from "../../../../lib/dbconnect";
import { Project, Subtask, Todo, User,Comment } from "../../../../models/user.model"
import { getDataFromToken } from "../../../../utils/getdatafromtoken"
import { NextResponse } from "next/server";

export async function POST(req, context) {
  await dbConnect();

  try {
    const id = getDataFromToken(req);
    const { title, description, priority, dueDate, tags } = await req.json();
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

    if ([title, description, priority, dueDate].some((field) => !field)) {
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
      assignedTo: id,
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

export async function GET(req,context) {
    try {
      await dbConnect();
      const id = getDataFromToken(req);
      const { params } = context;
      const projectId = params.projectId;
      if (!id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 });
      }

      const todos = await Project.findById(projectId)
      .populate("todos", "title description status priority _id dueDate completedAt tags project")
      .populate("createdBy", "username fullName")
      ;

      return NextResponse.json({ success: true, data:todos, message: " todos found" }, { status: 200 });
    } catch (error) {
      console.error("Error in GET /api/users/getalltodos:", error);
      return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req, context) {
  try {
    await dbConnect();
    const userId = getDataFromToken(req);
    const { params } = context;
    const projectId = params.projectId;
    
    // Check authentication
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Project ID" },
        { status: 400 }
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
    
    // Check if project belongs to the user
    if (project.createdBy.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: "You don't have permission to delete this project" },
        { status: 403 }
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
      
      // If this is a team project, remove from team
      if (project.team) {
        await Team.findByIdAndUpdate(
          project.team,
          { $pull: { projects: projectId } },
          { session }
        );
      }
      
      // Remove project reference from the user
      await User.findByIdAndUpdate(
        userId,
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
          data:projectId,
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
    console.error("Error in DELETE /api/projects/[projectId]:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
