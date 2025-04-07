import dbConnect from "../../../../../lib/dbconnect";
import { Project, Team, User } from "../../../../../models/user.model";
import { getDataFromToken } from "../../../../../utils/getdatafromtoken";
import { NextResponse } from "next/server";

export async function POST(req, context) {
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
    const { params } = context;
    const teamId = params.teamId;

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

    // Fetch user
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

    // Fetch team
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json(
        {
          success: false,
          message: "Team not found.",
          data: null,
        },
        { status: 404 }
      );
    }

    // Prepare members array from the team
    const members = team.members.map((member) => ({
      user: member.user,
      role: member.role === "admin" ? "admin" : "member", 
    }));

    // Create project
    const newProject = await Project.create({
      name,
      description,
      icon: icon || "📝",
      color: color || "#3498db",
      createdBy: user._id,
      team: teamId,
      isPersonal: false,
      members, 
    });

    // Add project to the team
    team.projects.push(newProject._id);
    await team.save();

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully and added to the team.",
        data: newProject,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      {
        success: false,
        error:error.message|| "Internal server error.",
        data: null,
      },
      { status: 500 }
    );
  }
}
