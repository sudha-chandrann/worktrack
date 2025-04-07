
import dbConnect from "../../../../../../../../../lib/dbconnect";
import { Comment, Subtask, Todo, User } from "../../../../../../../../../models/user.model";
import { getDataFromToken } from "../../../../../../../../../utils/getdatafromtoken";

import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  await dbConnect();

  try {
    const id = getDataFromToken(req);
    const updates = await req.json();
    const { params } = context;
    const todoId = params.todoId;
    const teamId= params.teamId;
    const subtaskId=params.subtaskId;

    if (!todoId|| !teamId || !subtaskId) {
      return NextResponse.json(
        {
          data: null,
          error: "todo ID ,teamId and subtaskId are required",
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
    const { todoId, subtaskId, } = params;

    if (!subtaskId || !todoId) {
      return NextResponse.json(
        { success: false, message: "Subtask ID and Todo ID are required" },
        { status: 400 }
      );
    }

    // Fetch the Todo and check if the subtask exists
    const todo = await Todo.findById(todoId).populate("subtasks").lean();
    if (!todo) {
      return NextResponse.json(
        { success: false, message: "Todo not found" },
        { status: 404 }
      );
    }

    // Fetch the subtask
    const subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
      return NextResponse.json(
        { success: false, message: "Subtask not found" },
        { status: 404 }
      );
    }

    // Validate ownership
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!todo.subtasks.some((t) => t._id.toString() === subtaskId)) {
      return NextResponse.json(
        { success: false, message: "Subtask does not belong to the specified Todo" },
        { status: 403 }
      );
    }

    // Check if the subtask is assigned to someone
    if (subtask.assignedTo && subtask.assignedTo.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: "You are not authorized to delete this subtask" },
        { status: 403 }
      );
    }

    // Remove the subtask reference from Todo
    await Todo.findByIdAndUpdate(todoId, { $pull: { subtasks: subtaskId } });

    // Delete all comments related to the subtask
    await Comment.deleteMany({ _id: { $in: subtask.comments } });

    // Delete the subtask itself
    await Subtask.findByIdAndDelete(subtaskId);

    return NextResponse.json(
      { success: true, message: "Subtask and related data deleted successfully" },
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
      const teamId = params.teamId;
      const todo = await Todo.findById(todoId);
  
      if (!todo|| !teamId || !subtaskId) {
        return NextResponse.json(
          {
            data: null,
            message: "todo , teamId and subtaskId not found",
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

