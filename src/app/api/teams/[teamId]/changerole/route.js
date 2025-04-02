import dbConnect from "../../../../../lib/dbconnect";
import { Team } from "../../../../../models/user.model";
import { getDataFromToken } from "../../../../../utils/getdatafromtoken";
import { NextResponse } from "next/server";

export async function POST(req, context) {
  try {
    await dbConnect();

    // Verify authentication
    const id = getDataFromToken(req);
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication failed. Please log in.",
          data: null,
        },
        { status: 401 }
      );
    }

    // Get and validate team ID from route parameters
    const { params } = context;
    const teamId = params.teamId;

    // Parse request body
    const requestBody = await req.json();
    const { userId, newRole } = requestBody;

    if (!userId || !newRole) {
      return NextResponse.json(
        { success: false, message: "User ID and new role are required", data: null },
        { status: 400 }
      );
    }

    // Find the team
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found", data: null },
        { status: 404 }
      );
    }

    // Check if the current user has admin permission
    const currentUserMembership = team.members.find(
      (member) => member.user.toString() === id.toString()
    );

    if (!currentUserMembership || currentUserMembership.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "You don't have permission to update roles",
          data: null,
        },
        { status: 403 }
      );
    }

    // Find the team member to update
    const memberToUpdate = team.members.find(
      (member) => member.user.toString() === userId.toString()
    );

    if (!memberToUpdate) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not a member of this team",
          data: null,
        },
        { status: 409 }
      );
    }

    // Update the role of the user
    memberToUpdate.role = newRole;
    await team.save(); // Save the updated team document

    return NextResponse.json(
      {
        success: true,
        message: `User role updated to ${newRole} successfully`,
        data: { userId, newRole },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating team member role:", error);
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
