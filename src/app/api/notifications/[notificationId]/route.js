import mongoose from "mongoose";
import dbConnect from "../../../../lib/dbconnect";
import { Notification, Team, User } from "../../../../models/user.model";
import { getDataFromToken } from "../../../../utils/getdatafromtoken";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  try {
    await dbConnect();

    // Authenticate user
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

    // Get and validate notification ID from route parameters
    const notificationId = context.params.notificationId;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid notification ID format",
          data: null,
        },
        { status: 400 }
      );
    }

    // Find and update notification
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true } // Return updated document
    );

    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Notification not found", data: null },
        { status: 404 }
      );
    }

    // Fetch the team associated with the notification
    const team = await Team.findById(notification.entityId);
    if (!team) {
      return NextResponse.json(
        {
          success: false,
          message: "Team not found",
          data: null,
        },
        { status: 404 }
      );
    }

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          data: null,
        },
        { status: 404 }
      );
    }

    // Check if the user is already in the team
    const isAlreadyMember = team.members.some(
      (member) => member.user.toString() === userId
    );

    const roleMatch = notification.message.match(/as (\w+)$/);
    const role = roleMatch ? roleMatch[1] : "member"; 

    // Add user to the team's members list
    if (!isAlreadyMember) {
      team.members.push({ user: user._id, role });
      await team.save();
    }

    // Add the team to the user's teams list if not already added
    if (!user.teams.includes(team._id)) {
      user.teams.push(team._id);
      await user.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: "User added to the team, and notification marked as read successfully",
        data: notification,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating notification and team membership:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update notification and team",
        data: null,
      },
      { status: 500 }
    );
  }
}


export async function DELETE(req, context) {
    try {
      await dbConnect();
  
      // Authenticate user
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
  
      // Get and validate notification ID from route parameters
      const notificationId = context.params.notificationId;
  
      if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid notification ID format",
            data: null,
          },
          { status: 400 }
        );
      }
  
      // Find and update notification
      const notification = await Notification.findByIdAndDelete( notificationId );
      if (!notification) {
        return NextResponse.json(
          { success: false, message: "Notification not found", data: null },
          { status: 404 }
        );
      }

  
      return NextResponse.json(
        {
          success: true,
          message: "notification is Deleted successfully",
          data: notification,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting notification :", error);
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Failed to delete notification",
          data: null,
        },
        { status: 500 }
      );
    }
 }
  