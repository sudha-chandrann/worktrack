
import dbConnect from "../../../../lib/dbconnect"
import { User } from "../../../../models/user.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, verificationCode, newPassword }  = await req.json();
    // Validate input fields
    if (!email || !verificationCode || !newPassword) {
      return NextResponse.json(
        { success: false, data: null, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });  
  

    if (!user || user.passwordResetCode !== verificationCode) {
        return NextResponse.json({
            success: false,
            data: null,
            message: "Invalid verification code",
        },{
            status: 404
        })
    }
    
    if (user.passwordResetExpires < new Date()) {
        return NextResponse.json({
            success: false,
            data: null,
            message: "Verification code has expired",
        },{
            status: 404
        })
    }


    user.password = newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    
    return NextResponse.json(
      {
        success: true,
        data:null,
        message: "password is reset   successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Password Reset error:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
