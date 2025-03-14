// src/pages/api/users/logout.js
import dbConnect from "../../../../lib/dbconnect"
import { NextResponse } from "next/server";

// User logout endpoint
export async function GET(req) {
  try {
    await dbConnect();
    
    // Create response with success message
    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
      data: null
    }, { status: 200 });
    
    // Clear the refresh token cookie
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immediately
      path: "/" // Ensure cookie is cleared for all paths
    });
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    
    return NextResponse.json({
      success: false,
      message: error.message || "Internal Server Error",
      data: null
    }, { status: 500 });
  }
}