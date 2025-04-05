import dbConnect from "../../../../../lib/dbconnect";
import { Team ,User,Project} from "../../../../../models/user.model";
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

export async function PATCH(req, context) {
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
    const { userId } = requestBody;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required", data: null },
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
          message: "You don't have permission to remove members",
          data: null,
        },
        { status: 403 }
      );
    }
    
    // Find the index of the user to be removed
    const memberIndex = team.members.findIndex(
      (member) => member.user.toString() === userId.toString()
    );
    
    if (memberIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not a member of this team",
          data: null,
        },
        { status: 409 }
      );
    }
    
    // Remove the user from the team's members list
    team.members.splice(memberIndex, 1);
    await team.save();
    
    // Find and update all team projects to remove the user
    if (team.projects && team.projects.length > 0) {
      await Project.updateMany(
        { _id: { $in: team.projects } },
        { $pull: { members: { user: userId } } }
      );
    }
    
    const user = await User.findById(userId);
    if (user) {
      user.teams = user.teams.filter(
        (team) => team.toString() !== teamId.toString()
      );
      await user.save();
    }
    
    return NextResponse.json(
      {
        success: true,
        message: "User removed from the team and all associated projects successfully",
        data: { userId },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing team member:", error);
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