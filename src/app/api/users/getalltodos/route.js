import dbConnect from "../../../../lib/dbconnect"
import { Subtask, Todo } from "../../../../models/user.model";
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

    
      
      const todos = await Todo.find({
        assignedTo: id
      })
      .populate("project", "name description icon color _id")
      .populate("assignedTo", "username fullName")
      .populate("assignedBy", "username fullName")
      ;

      return NextResponse.json({ success: true, data:todos, message: " todos found" }, { status: 200 });
    } catch (error) {
      console.error("Error in GET /api/users/getalltodos:", error);
      return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
  }