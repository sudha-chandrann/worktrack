import dbConnect from "../../../lib/dbconnect"
import { User } from "../../../models/user.model";
import { getDataFromToken } from "../../../utils/getdatafromtoken"
import { NextResponse } from "next/server";

import mongoose from "mongoose";


export async function GET(req) {
  try {
    await dbConnect(); // Ensure DB is connected

    const userId = getDataFromToken(req);

    // Validate token & ID
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 });
    }

    // Fetch user with selected fields for security and performance
    const user = await User.findById(userId)
    .select("-password -refreshToken")
    .populate({
      path: "projects",
      select: "name description icon color"
    })
    .populate({
      path: "teams",
      select: "name description"
    });
  

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user, message: "User found" }, { status: 200 });
  } catch (error) {
    console.error("Error in geting user profile", error);
    return NextResponse.json({ success: false, message: "Failed to get userProfile" }, { status: 500 });
  }
}


export async function PATCH(req) {
    try {
      await dbConnect(); // Ensure DB is connected
  
      const userId = getDataFromToken(req);
  
      // Validate token & ID
      if (!userId) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 });
      }
  
      const { fullName, username } =await req.json();
    
      const updateFields = {};
      
      if (fullName) updateFields.fullName = fullName;
      if (username) updateFields.username = username;
      
      // Ensure username uniqueness if it's being updated
      if (username) {
        const existingUser = await User.findOne({ 
          username, 
          _id: { $ne: userId} 
        });
        
        if (existingUser) {
          return NextResponse.json({
            data:null,
            success: false,
            message: "Username already taken"
          },{status:400});
        }
      }
  
      const updatedUser = await User.findByIdAndUpdate(
         userId,
        { $set: updateFields },
        { new: true }
      ).select("-password -refreshToken");
  
      if (!updatedUser) {
        return NextResponse.json({
          data:null,
          success: false,
          message: "User not found"
        },{status:404});
      }

  
      return NextResponse.json({ success: true, data: updatedUser, message: "Profile updated successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error  in updating profile", error);
      return NextResponse.json({ success: false, message: "Failed to update Profile"}, { status: 500 });
    }
}