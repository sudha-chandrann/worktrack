import dbConnect from "../../../../lib/dbconnect"
import { User } from "../../../../models/user.model";
import { NextResponse } from "next/server";

//  Generate access and refresh tokens for a user
 
const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    
    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

//  User login endpoint

export async function POST(req) {
  try {
    await dbConnect();
    
    const { email, password, username } = await req.json();
    
    // Validate required fields
    if (!email && !username) {
      return NextResponse.json({
        success: false,
        message: "Username or email is required",
        data: null
      }, { status: 400 });
    }
    
    if (!password) {
      return NextResponse.json({
        success: false,
        message: "Password is required",
        data: null
      }, { status: 400 });
    }
    
    // Find existing user
    const existingUser = await User.findOne({
      $or: [
        { email: email?.trim() }, 
        { username: username?.trim() }
      ]
    });
    
    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: "User with this email or username does not exist",
        data: null
      }, { status: 404 });
    }
    
    // Verify password
    const isPasswordCorrect = await existingUser.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return NextResponse.json({
        success: false,
        message: "Invalid credentials",
        data: null
      }, { status: 401 });
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(existingUser._id);
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        userid: existingUser._id,
      }
    }, { status: 200 });
    
    // Set refresh token in HTTP-only cookie
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({
      success: false,
      message:error.message || "Internal server error",
      data: error
    }, { status: 500 });
  }
}