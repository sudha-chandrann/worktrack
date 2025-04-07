import dbConnect from "../../../lib/dbconnect";
import { Team, User } from "../../../models/user.model";
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

    const { name, description } = await req.json();
    if (!name || !description) {
      return NextResponse.json(
        {
          success: false,
          error: "tean name and description are required.",
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

    const newTeam = await Team.create({
        name,
        description: description,
        members: [{
          user: user._id,
          role: "admin",
          joinedAt: new Date()
        }],
        createdBy: user._id,
      });
  

    // Add the project to the user's projects list
    user.teams.push(newTeam._id);
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Team created successfully.",
        data: newTeam
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating team:", error);
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
