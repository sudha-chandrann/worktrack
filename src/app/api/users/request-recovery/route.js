
import { sendRecoveryEmail } from "../../../../utils/nodemailer"
import dbConnect from "../../../../lib/dbconnect"
import { User } from "../../../../models/user.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { email} = await req.json();
    // Validate input fields
    if (!email) {
      return NextResponse.json(
        { success: false, data: null, message: "email is required" },
        { status: 400 }
      );
    }

    const user= await User.findOne({email});
    if (!user) {
        return NextResponse.json({
            success: false,
            data: null,
            message: "User is not found ",
        },{
            status: 404
        })
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expiry = new Date(Date.now() + 10 * 60 * 1000); 
    user.passwordResetCode = code;
    user.passwordResetExpires = expiry;
    await user.save();
    await sendRecoveryEmail(email,code);
    
    return NextResponse.json(
      {
        success: true,
        data:null,
        message: "email is send  successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Email Verfication error:", error);
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
