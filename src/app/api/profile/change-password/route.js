import dbConnect from "../../../../lib/dbconnect";
import { User } from "../../../../models/user.model";
import { getDataFromToken } from "../../../../utils/getdatafromtoken";
import { NextResponse } from "next/server";

import mongoose from "mongoose";

export async function POST(req) {
  try {
    await dbConnect(); // Ensure DB is connected

    const userId = getDataFromToken(req);

    // Validate token & ID
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: "Both current and new password are required",
        },
        { status: 400 }
      );
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: "Password should be at least 8 characters",
        },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    const isPasswordValid = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: "Current password is incorrect",
        },
        { status: 404 }
      );
    }
    // Update password
    user.password = newPassword;
    await user.save();


    return NextResponse.json(
      {
        success: true,
        message: "Password changed successfully"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { success: false, message: error.message||"Failed to change password" },
      { status: 500 }
    );
  }
}
