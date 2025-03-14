// src/pages/api/users/register.js
import dbConnect from "../../../../lib/dbconnect"
import { User,Todo } from "../../../../models/user.model";
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
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    const inboxId = user.inbox;
    
    if (!inboxId) {
      return NextResponse.json({
        data:null,
        success: false,
        message: 'Inbox not found for this user'
      },{
        status: 404
      });
    }
    const todos = await Todo.find({ project: user.inbox })
    .populate('assignedTo', 'username fullName')
    .populate('assignedBy', 'username fullName')
    .sort({ dueDate: 1, priority: 1 })

    return NextResponse.json({ success: true, data: todos, message: "User found" }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/users/getuserinbox:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
