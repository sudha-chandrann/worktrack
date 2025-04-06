// src/pages/api/users/register.js
import dbConnect from "../../../../lib/dbconnect"
import { User } from "../../../../models/user.model";
import { getDataFromToken } from "../../../../utils/getdatafromtoken";
import { NextResponse } from "next/server";

import mongoose from "mongoose";


export async function GET(req) {
  try {
    await dbConnect(); // Ensure DB is connected

    const id = getDataFromToken(req);

    // Validate token & ID
    if (!id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 });
    }

    // Fetch user with selected fields for security and performance
    const user = await User.findById(id)
    .select("_id username email projects inbox teams") 
    .populate({
      path: "projects",
      select: "_id name icon", 
    })
    .populate({
      path: "teams",
      select: "_id name ", 
    })
    .lean(); // Optimize query performance
  

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user, message: "User found" }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/users/register:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
