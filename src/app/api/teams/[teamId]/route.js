
import mongoose from "mongoose";
import dbConnect from "../../../../lib/dbconnect";
import { Team } from "../../../../models/user.model"
import { getDataFromToken } from "../../../../utils/getdatafromtoken"
import { NextResponse } from "next/server";



export async function GET(req, context) {
    try {
      await dbConnect();
      
      // Authenticate user
      const userId = getDataFromToken(req);
      if (!userId) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Authentication failed. Please log in.",
            data: null 
          }, 
          { status: 401 }
        );
      }
      
      // Get and validate team ID from route parameters
      const { params } = context;
      const teamId = params.teamId;
      
      if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Invalid team ID format",
            data: null 
          }, 
          { status: 400 }
        );
      }
  
      // Find team and populate member and creator details
      const team = await Team.findById(teamId)
        .populate({
          path: "members.user",
          select: "username email fullName " // Include relevant user fields
        })
        .populate({
          path: "createdBy",
          select: "username email fullName "
        })
        .populate({
          path: "projects",
          select: "name description icon color createdBy",
          populate: {
            path: "createdBy",
            select: "username email fullName"
          }
        });
        
      if (!team) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Team not found",
            data: null 
          }, 
          { status: 404 }
        );
      }
      
      // Check if the requesting user is a member of this team
      const userMember = team.members.find(member => 
        member.user._id.toString() === userId.toString()
      );
      
      if (!userMember) {
        return NextResponse.json(
          { 
            success: false, 
            message: "You don't have permission to view this team",
            data: null 
          }, 
          { status: 403 }
        );
      }
  
      const isAdmin = userMember && userMember.role === "admin";

  
      return NextResponse.json(
        { 
          success: true, 
          message: "Team details retrieved successfully",
          data: {
            team: team,
            isAdmin: isAdmin
          }
        }, 
        { status: 200 }
      );
      
    } catch (error) {
      console.error("Error getting team details:", error);
      return NextResponse.json(
        { 
          success: false, 
          message: "Failed to retrieve team details",
          data: null 
        }, 
        { status: 500 }
      );
    }
  }


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
            data: null 
          }, 
          { status: 401 }
        );
      }
      
      // Get and validate team ID from route parameters
      const { params } = context;
      const teamId = params.teamId;
      
      if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Invalid team ID format",
            data: null 
          }, 
          { status: 400 }
        );
      }
  
      // Find the team to get existing members
      const team = await Team.findById(teamId);
      if (!team) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Team not found",
            data: null 
          }, 
          { status: 404 }
        );
      }
      
      // Check if the requesting user is an admin of this team
      const requestingUser = team.members.find(member => 
        member.user.toString() === userId
      );
      
      if (!requestingUser || requestingUser.role !== "admin") {
        return NextResponse.json(
          { 
            success: false, 
            message: "Only team admins can view available users",
            data: null 
          }, 
          { status: 403 }
        );
      }
      
      // Get existing member IDs
      const existingMemberIds = team.members.map(member => member.user.toString());
      
      // Find all users who are not members of this team
      const availableUsers = await User.find({
        _id: { $nin: existingMemberIds }
      }).select("_id username email fullName");
      
      return NextResponse.json(
        { 
          success: true, 
          message: "Available users retrieved successfully",
          data: availableUsers
        }, 
        { status: 200 }
      );
      
    } catch (error) {
      console.error("Error getting available users:", error);
      return NextResponse.json(
        { 
          success: false, 
          message: "Failed to retrieve available users",
          data: null 
        }, 
        { status: 500 }
      );
    }
  }  