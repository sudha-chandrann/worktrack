import dbConnect from "../../../../lib/dbconnect"
import { getDataFromToken } from "../../../../utils/getdatafromtoken";
import { NextResponse } from "next/server";

import mongoose from "mongoose";


export async function GET(req) {
  try {
    await dbConnect();
    
    const id = getDataFromToken(req);
    if (!id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 });
    }
    
    // Create start and end of day in UTC to avoid timezone issues
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    
    // Import Todo and Subtask models explicitly if they're not already imported
    const { Todo, Subtask } = await import("../../../../models/user.model");
    
    // Run queries in parallel for better performance
    const [todos, subtasks] = await Promise.all([
      Todo.find({
        assignedTo: new mongoose.Types.ObjectId(id),
        dueDate: { $gte: startOfDay, $lte: endOfDay }
      })
      .lean() // Use lean() for better performance
      .populate("project", "name description icon color _id")
      .populate("assignedTo", "username fullName")
      .populate("assignedBy", "username fullName"),

      Subtask.find({
        assignedTo: new mongoose.Types.ObjectId(id),
        dueDate: { $gte: startOfDay, $lte: endOfDay }
      })
      .lean() // Use lean() for better performance
      .populate({
        path: "parentTask", 
        select: "title status priority dueDate _id project",
        populate: {
          path: "project",
          select: "name icon color _id"
        }
      })
      .populate("assignedTo", "username fullName")
    ]);
    
        
    return NextResponse.json({ 
      success: true, 
      data: {
        todos: todos,
        subtasks: subtasks
      }, 
      message: "Today's todos found" 
    }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/users/gettodaytodos:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Internal Server Error",
      // Include error details in development
      ...(process.env.NODE_ENV !== 'production' && { error: error.stack })
    }, { status: 500 });
  }
}