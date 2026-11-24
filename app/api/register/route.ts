// register controller : POST
import users from "@/models/userModel";
import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";


export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!name || !normalizedEmail || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required", data: {} },
        { status: 400 },
      );
    }

    const existingUser = await users.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json(
        { message: "Already Registered..... Please Login ", data: {} },
        { status: 409 },
      );
    } else {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const newUser = await users.create({
        name,
        email: normalizedEmail,
        password: encryptedPassword,
      });
      return NextResponse.json(
        {
          message: "User Register successfully ",
          data: newUser,
        },
        { status: 201 },
      );
    }
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json(
      { message: "Registration failed", data: {} },
      { status: 500 },
    );
  }
}
