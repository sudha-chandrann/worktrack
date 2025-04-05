// src/pages/api/users/register.js
import dbConnect from "../../../../lib/dbconnect"
import { User ,Project} from "../../../../models/user.model"
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password, username, fullName } = await req.json();
    const trimmedEmail = email?.trim();
    const trimmedUsername = username?.trim();
    const trimmedPassword = password?.trim();
    const trimmedfullName = fullName?.trim();

    // Validate input fields
    if (
      [trimmedEmail, trimmedUsername, trimmedPassword, trimmedfullName].some(
        (field) => !field
      )
    ) {
      return NextResponse.json(
        { success: false, data: null, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        {
          success: false,
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
          success: false,
          data: null,
          message: "Password must be at least 8 characters long",
        },

        { status: 400 }
      );
    }

    // Check for existing users
    const existingUser = await User.findOne({
      $or: [{ email: trimmedEmail }, { username: trimmedUsername }],
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "User with same email or username already exists",
        },
        { status: 409 }
      );
    }

    // Create user
    const user = await User.create({
      email: trimmedEmail,
      username: trimmedUsername,
      password: trimmedPassword,
      fullName: trimmedfullName,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, data: null, message: "Failed to create new user" },
        { status: 500 }
      );
    }
    const inbox = await Project.create({
      name: "Inbox",
      description: "Your inbox",
      createdBy: user._id,
    });

    const updateduser = await User.findByIdAndUpdate(
      user._id,
      {
        inbox: inbox._id,
      },
      {
        new: true,
      }
    );

    return NextResponse.json(
      {
        success: true,
        data: updateduser._id,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        data: error,
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
