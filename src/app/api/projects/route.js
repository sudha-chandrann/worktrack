import dbConnect from "../../../lib/dbconnect";
import { Project, User } from "../../../models/user.model";
import { getDataFromToken } from "../../../utils/getdatafromtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  try {
    const userId = getDataFromToken(req);
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication failed. User ID is required.",
          data: null,
        },
        { status: 401 }
      );
    }

    const { name, description, icon, color } = await req.json();
    if (!name || !description) {
      return NextResponse.json(
        {
          success: false,
          error: "Project name and description are required.",
          data: null,
        },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found.",
          data: null,
        },
        { status: 404 }
      );
    }

    const newProject = await Project.create({
      name,
      description,
      icon: icon || "📝",
      color: color || "#3498db",
      createdBy: user._id,
      isPersonal: true,
    });

    // Add the project to the user's projects list
    user.projects.push(newProject._id);
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully.",
        data: newProject,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error.",
        data: null,
      },
      { status: 500 }
    );
  }
}
