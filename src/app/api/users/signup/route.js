// src/pages/api/users/register.js
import dbConnect from "@/lib/dbconnect";
import { NextResponse } from "next/server";
import { Client } from "@/models/user.model";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password, username } = await req.json();
    const trimmedEmail = email?.trim();
    const trimmedUsername = username?.trim();
    const trimmedPassword = password?.trim();

    // Validate input fields
    if (
      [trimmedEmail, trimmedUsername, trimmedPassword].some((field) => !field)
    ) {
      return NextResponse.json(
        {
          data: null,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        {
            data: null,
            message: "Please provide a valid email address",
          },
        { status: 400 }
      );
    }

    // Password strength validation
    if (trimmedPassword.length < 8) {
      return NextResponse.json(
        {
            data: null,
            message: "Password must be at least 8 characters long",
          },

        { status: 400 }
      );
    }

    // Check for existing users
    const existingUser = await Client.findOne({
      $or: [{ email: trimmedEmail }, { username: trimmedUsername }],
    });

    if (existingUser) {
      return NextResponse.json(
        {
            data: null,
            message: "User with same email or username already exists",
          },
        { status: 409 }
      );
    }

    // Create user
    const user = await Client.create({
      email: trimmedEmail,
      username: trimmedUsername,
      password: trimmedPassword,
    });

    if (!user) {
      return NextResponse.json(
        {
            data: null,
            message: "Failed to create new user",
          },
        { status: 500 }
      );
    }
    return NextResponse.json(
       { data: user._id ,message:"User created successfully"},
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      new ApiResponse(500, null, "Internal server error"),
      { status: 500 }
    );
  }
}
