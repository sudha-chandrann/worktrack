import dbConnect from "../../../../../lib/dbconnect";
import { Team, User, Notification } from "../../../../../models/user.model";
import { getDataFromToken } from "../../../../../utils/getdatafromtoken";
import { NextResponse } from "next/server";

export async function POST(req, context) {
  try {
    await dbConnect();

    // Verify authentication
    const userId = getDataFromToken(req);
    if (!userId) {
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

    // Parse request body - fixed the undefined req.body issue
    const requestBody = await req.json();
    const { memberId, role } = requestBody;

    if (!memberId) {
      return NextResponse.json(
        { success: false, message: "User ID is required", data: null },
        { status: 401 }
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
      (member) => member.user.toString() === userId.toString()
    );

    if (!currentUserMembership || currentUserMembership.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "You don't have permission to add members",
          data: null,
        },
        { status: 403 }
      );
    }

    // Check if user exists
    const userToAdd = await User.findById(memberId);
    if (!userToAdd) {
      return NextResponse.json(
        { success: false, message: "User not found", data: null },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const isAlreadyMember = team.members.some(
      (member) => member.user.toString() === memberId.toString()
    );

    if (isAlreadyMember) {
      return NextResponse.json(
        {
          success: false,
          message: "User is already a member of this team",
          data: null,
        },
        { status: 409 } // Changed to 409 Conflict which is more appropriate
      );
    }
    // Create a notification for the user
    const notification = await Notification.create({
      recipient: memberId,
      sender: userId,
      type: "invitation",
      entityType: "team",
      entityId: teamId,
      message: `You have been invited to join the team "${team.name}" as ${role}`,
      link: `/teams/${teamId}`,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Invitation sent successfully",
        data: {
          notificationId: notification._id,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding team member:", error);
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
