import dbConnect from "../../../../../../../../lib/dbconnect";
import {
  Comment,
  Project,
  Subtask,
  Team,
  Todo,
  User,
} from "../../../../../../../../models/user.model";
import { getDataFromToken } from "../../../../../../../../utils/getdatafromtoken";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  await dbConnect();

  try {
    const id = getDataFromToken(req);
    const updates = await req.json();
    const { params } = context;
    const projectId = params.projectId;
    const todoId = params.todoId;
    const teamId = params.teamId;

    if (!projectId || !teamId) {
      return NextResponse.json(
        {
          data: null,
          error: "Project ID and Team Id is required",
          success: false,
        },
        {
          status: 404,
        }
      );
    }
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json(
        {
          data: null,
          message: "Team not found",
          success: false,
        },
        {
          status: 404,
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
      );
    }

    const isMember = team.members.find(
      (member) => member.user.toString() === id.toString()
    );

    if (!isMember) {
      return NextResponse.json(
        { success: false, message: "You are not a member of this team" },
        { status: 403 }
      );
    }

    if (updates.status === "completed" && !updates.completedAt) {
      updates.completedAt = new Date();
    }

    const updatedTodo = await Todo.findByIdAndUpdate(todoId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedTodo) {
      return NextResponse.json(
        {
          success: false,
          message: "Todo not found",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: " Todo is updated successfully",
        data: updatedTodo,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating  todo:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req, context) {
  await dbConnect();

  try {
    const userId = getDataFromToken(req);
    const { params } = context;
    const { projectId, todoId, teamId } = params;

    if (!projectId || !todoId || !teamId) {
      return NextResponse.json(
        { success: false, message: "Project ID and Todo ID are required" },
        { status: 400 }
      );
    }

    // Fetch project with todos
    const project = await Project.findById(projectId).populate("todos").lean();
    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    const team = await Team.findById(teamId).populate("members").lean();
    if (!team) {
      return NextResponse.json(
        { success: false, message: "team not found" },
        { status: 404 }
      );
    }

    // Fetch todo and validate ownership
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return NextResponse.json(
        { success: false, message: "Todo not found" },
        { status: 404 }
      );
    }

    const isMember = team.members.find(
      (member) => member.user.toString() === userId.toString()
    );

    if (!isMember) {
      return NextResponse.json(
        { success: false, message: "You are not a member of this team" },
        { status: 403 }
      );
    }
    const isAdmin = isMember.role === "admin";

    // Check if user has permission (only the assigned user can delete)
    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to delete this todo",
        },
        { status: 403 }
      );
    }

    // Check if todo belongs to the project
    if (!project.todos.some((t) => t._id.toString() === todoId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Todo does not belong to the specified project",
        },
        { status: 403 }
      );
    }

    // Remove todo from the project
    await Project.findByIdAndUpdate(projectId, { $pull: { todos: todoId } });

    // Delete related subtasks
    await Subtask.deleteMany({ _id: { $in: todo.subtasks } });

    // Delete related comments
    await Comment.deleteMany({ _id: { $in: todo.comments } });

    // Delete the todo itself
    await Todo.findByIdAndDelete(todoId);

    return NextResponse.json(
      { success: true, message: "Todo and related data deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { success: false, message:error.message||"Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req, context) {
  try {
    // Connect to database
    await dbConnect();

    // Get user ID from token
    const userId = getDataFromToken(req);

    // Extract parameters from context
    const { params } = context;
    const { projectId, todoId, teamId } = params;

    // Validate required parameters
    if (!projectId || !teamId || !todoId) {
      return NextResponse.json(
        {
          success: false,
          message: "Project ID, Team ID, and Todo ID are required",
          data: null,
        },
        { status: 400 }
      );
    }

    // Find team by ID
    const team = await Team.findById(teamId).populate({
      path: "members.user",
      select: "username fullName email _id",
    });

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

    // Find project by ID
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found",
          data: null,
        },
        { status: 404 }
      );
    }

    // Find todo with detailed population
    const todo = await Todo.findById(todoId)
      .populate("assignedTo", "username fullName email")
      .populate("assignedBy", "username fullName email")
      .populate("project", "name description icon color")
      .populate({
        path: "subtasks",
        populate: {
          path: "assignedTo",
          select: "username fullName email",
        },
      })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "username fullName",
        },
      });

    if (!todo) {
      return NextResponse.json(
        {
          success: false,
          message: "Todo not found",
          data: null,
        },
        { status: 404 }
      );
    }

    // Format team members data with detailed user information
    const formattedMembers = team.members.map((member) => ({
      user: {
        _id: member.user._id,
        username: member.user.username,
        fullName: member.user.fullName,
        email: member.user.email,
      },
      role: member.role,
      joinedAt: member.joinedAt,
    }));

    // Check if current user is an admin
    const isAdmin = team.members.some(
      (member) =>
        member.user._id.toString() === userId && member.role === "admin"
    );

    // Return successful response with all requested data
    return NextResponse.json(
      {
        success: true,
        message: "Todo retrieved successfully",
        data: {
          todo: todo,
          members: formattedMembers,
          isAdmin: isAdmin,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching todo data:", error);
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

export async function POST(req, context) {
  await dbConnect();

  try {
    const id = getDataFromToken(req);
    const { title, description, priority, dueDate, status, parentTask } =
      await req.json();
    const { params } = context;
    const projectId = params.projectId;
    const todoId = params.todoId;
    const teamId = params.teamId;

    if (!projectId || !teamId || !todoId) {
      return NextResponse.json(
        {
          data: null,
          message: "Project ID, team Id and Todo Id are required",
          success: false,
        },
        {
          status: 404,
        }
      );
    }
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json(
        {
          data: null,
          message: "team not found",
          success: false,
        },
        {
          status: 404,
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
      );
    }
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return NextResponse.json(
        {
          data: null,
          message: "todo not found",
          success: false,
        },
        {
          status: 404,
        }
      );
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

    const newsubtask = await Subtask.create({
      title,
      description,
      priority: priority || "medium",
      dueDate: dueDate || null,
      parentTask: parentTask || todoId,
      assignedTo: id,
      status: status || "to-do",
    });

    await Todo.findByIdAndUpdate(todoId, {
      $push: { subtasks: newsubtask._id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "new Subtask is Created successfully",
        data: newsubtask,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating Subtask:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}
