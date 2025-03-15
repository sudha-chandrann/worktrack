
import dbConnect from "../../../../../../../lib/dbconnect";
import { Subtask, Todo, User } from "../../../../../../../models/user.model";
import { getDataFromToken } from "../../../../../../../utils/getdatafromtoken";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  await dbConnect();

  try {
    const id = getDataFromToken(req);
    const updates = await req.json();
    const { params } = context;
    const todoId = params.todoId;
    const subtaskId=params.subtaskId;

    if (!todoId) {
      return NextResponse.json(
        {
          data: null,
          error: "todo ID is required",
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

    if (updates.status === "completed" && !updates.completedAt) {
      updates.completedAt = new Date();
    }

    const updatedsubtask = await Subtask.findByIdAndUpdate(subtaskId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedsubtask) {
      return NextResponse.json(
        {
          success: false,
          message: "subTask not found",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: " Todo is updated successfully",
        data: updatedsubtask,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating  subtodo:", error);
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
    const {  todoId,subtaskId } = params;

    if (!subtaskId || !todoId) {
      return NextResponse.json(
        { success: false, message: "subtask ID and Todo ID are required" },
        { status: 400 }
      );
    }

    // Fetch project along with todos
    const todo = await Todo.findById(todoId).populate("subtasks").lean();
    if (!todo) {
      return NextResponse.json(
        { success: false, message: "todo not found" },
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

    const subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
      return NextResponse.json(
        { success: false, message: "subtask not found" },
        { status: 404 }
      );
    }

    // Check if user has access to delete this todo
    if (!todo.subtasks.some((t) => t._id.toString() === subtaskId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Subtask does not belong to the specified Todo",
        },
        { status: 403 }
      );
    }

    // Remove the todo from the project and delete it
    await Todo.findByIdAndUpdate(todoId, { $pull: { subtasks: subtaskId } });

    await Subtask.findByIdAndDelete(subtaskId);

    return NextResponse.json(
      { success: true, message: "subtask deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting subtask:", error);
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
      const todoId = params.todoId;
      const subtaskId= params.subtaskId;
  
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
  
      const subtask = await Subtask.findById(subtaskId)
        .populate("assignedTo", "username fullName")
        .populate("parentTask", "title status priority dueDate")
        .populate({
          path: "comments",
          populate: {
            path: "author",
            select: "username fullName",
          },
        });
      if (!subtask) {
        return NextResponse.json(
          { data: null, success: false, message: "Todo not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          success: true,
          message: " subtask is found  successfully",
          data: subtask,
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.error("Error geting subtask:", error);
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

