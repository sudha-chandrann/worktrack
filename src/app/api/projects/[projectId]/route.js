
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


