import dbConnect from "../../../../../../lib/dbconnect";
import { Project, Subtask, Todo, User } from "../../../../../../models/user.model";
import { getDataFromToken } from "../../../../../../utils/getdatafromtoken";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  await dbConnect();

  try {
    const id = getDataFromToken(req);
    const updates = await req.json();
    const { params } = context;
    const projectId = params.projectId;
    const todoId = params.todoId;

    if (!projectId) {
      return NextResponse.json(
        {
          data: null,
          error: "Project ID is required",
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
    const { projectId, todoId } = params;

    if (!projectId || !todoId) {
      return NextResponse.json(
        { success: false, message: "Project ID and Todo ID are required" },
        { status: 400 }
      );
    }

    // Fetch project along with todos
    const project = await Project.findById(projectId).populate("todos").lean();
    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    // Fetch user and validate ownership
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const todo = await Todo.findById(todoId);
    if (!todo) {
      return NextResponse.json(
        { success: false, message: "Todo not found" },
        { status: 404 }
      );
    }

    // Check if user has access to delete this todo
    if (!project.todos.some((t) => t._id.toString() === todoId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Todo does not belong to the specified project",
        },
        { status: 403 }
      );
    }

    // Remove the todo from the project and delete it
    await Project.findByIdAndUpdate(projectId, { $pull: { todos: todoId } });

    await Todo.findByIdAndDelete(todoId);

    return NextResponse.json(
      { success: true, message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting inbox todo:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req, context) {
  await dbConnect();

  try {
    const id = getDataFromToken(req);
    const { params } = context;
    const projectId = params.projectId;
    const todoId = params.todoId;

    if (!projectId) {
      return NextResponse.json(
        {
          data: null,
          error: "Project ID is required",
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

    const todo = await Todo.findById(todoId)
      .populate("assignedTo", "username fullName")
      .populate("assignedBy", "username fullName")
      .populate("project", "name description icon color")
      .populate({
        path: "subtasks",
        populate: {
          path: "assignedTo",
          select: "username fullName",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username fullName",
        },
      });
    if (!todo) {
      return NextResponse.json(
        { data: null, success: false, message: "Todo not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: " Todo is found  successfully",
        data: todo,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error geting todo:", error);
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

export async function POST(req, context) {
  await dbConnect();

  try {
    const id = getDataFromToken(req);
    const { title, description, priority, dueDate, status,parentTask } = await req.json();
    const { params } = context;
    const projectId = params.projectId;
    const todoId=params.todoId;

    if (!projectId) {
      return NextResponse.json(
        {
          data: null,
          error: "Project ID is required",
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
        )
    }
    const todo= await Todo.findById(todoId);
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

    const newsubtask = await Subtask.create({
      title,
      description,
      priority: priority || "medium",
      dueDate: dueDate || null,
      parentTask:parentTask||todoId,
      assignedTo: id,
      status: status||"to-do",
    });

    await Todo.findByIdAndUpdate(todoId, {
      $push: { subtasks: newsubtask._id },
    });

    return NextResponse.json(
      {
        success:true,
        message:"new Subtask is Created successfully",
        data:newsubtask
      },
      {
        status:200
      }
    );
  } catch (error) {
    console.error('Error creating Subtask:', error);
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

