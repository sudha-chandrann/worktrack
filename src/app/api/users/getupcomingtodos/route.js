// src/pages/api/users/register.js
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

      
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const todos = await Todo.find({
        assignedTo: id,
        dueDate: { $gte: endOfDay }
      })
      .populate("project", "name description icon color _id")
      .populate("assignedTo", "username fullName")
      .populate("assignedBy", "username fullName")
      ;

      return NextResponse.json({ success: true, data:todos, message: "upcoming's todos found" }, { status: 200 });
    } catch (error) {
      console.error("Error in GET /api/users/getupcomingtodos:", error);
      return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
  }