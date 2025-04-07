import dbConnect from "../../../lib/dbconnect"
import { Notification } from "../../../models/user.model";
import { getDataFromToken } from "../../../utils/getdatafromtoken";
import { NextResponse } from "next/server";

import mongoose from "mongoose";


export async function GET(req) {
  try {
    await dbConnect(); // Ensure DB is connected

    const id = getDataFromToken(req);
    if (!id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 });
    }

    const notifications = await Notification.find({recipient:id})
    .populate("sender", "fullName email username _id")
    .sort({ createdAt: -1 })

  
  return NextResponse.json(
    {
      success: true,
      message: "Notifications fetched successfully",
      data: notifications,
      
    },
    { status: 200 }
  );
  } catch (error) {
    console.error("Error in GET notification", error);
    return NextResponse.json({ success: false, message: error.message||"Internal Server Error" }, { status: 500 });
  }
}
