
import { connectDB } from "@/lib/mongodb";
import events from "@/models/eventModel";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

async function getCurrentUserId(email: string) {
    const users = (await import("@/models/userModel")).default;

    const user = await users.findOne({ email }).select("_id");

    return user?._id;
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid event ID" },
                { status: 400 }
            );
        }

        await connectDB();

        const userId = await getCurrentUserId(session.user.email);

        if (!userId) {
            return NextResponse.json(
                { message: "User account not found" },
                { status: 404 }
            );
        }

        const event = await events.findOne({
            _id: id,
            userId,
        });

        if (!event) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Event fetched successfully", data: event },
            { status: 200 }
        );
    } catch (error) {
        console.error("FETCH EVENT ERROR:", error);

        return NextResponse.json(
            { message: "Failed to fetch event" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid event ID" },
                { status: 400 }
            );
        }

        await connectDB();

        const userId = await getCurrentUserId(session.user.email);

        if (!userId) {
            return NextResponse.json(
                { message: "User account not found" },
                { status: 404 }
            );
        }

        const body = await req.json();

        const name = String(body.name || "").trim();
        const description = String(body.description || "").trim();
        const venue = String(body.venue || "").trim();
        const type = String(body.type || "").trim();
        const date = body.date;
        const status = body.status;

        if (!name || !description || !venue || !type || !date || !status) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        if (Number.isNaN(new Date(date).getTime())) {
            return NextResponse.json(
                { message: "Invalid event date" },
                { status: 400 }
            );
        }

        if (!["Upcoming", "Completed", "Cancelled"].includes(status)) {
            return NextResponse.json(
                { message: "Invalid event status" },
                { status: 400 }
            );
        }

        const updatedEvent = await events.findOneAndUpdate(
            { _id: id, userId },
            {
                name,
                description,
                date: new Date(date),
                venue,
                type,
                status,
            },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Event updated successfully",
                data: updatedEvent,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("UPDATE EVENT ERROR:", error);

        return NextResponse.json(
            { message: "Failed to update event" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid event ID" },
                { status: 400 }
            );
        }

        await connectDB();

        const userId = await getCurrentUserId(session.user.email);

        if (!userId) {
            return NextResponse.json(
                { message: "User account not found" },
                { status: 404 }
            );
        }

        const deletedEvent = await events.findOneAndDelete({
            _id: id,
            userId,
        });

        if (!deletedEvent) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Event deleted successfully",
                data: deletedEvent,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE EVENT ERROR:", error);

        return NextResponse.json(
            { message: "Failed to delete event" },
            { status: 500 }
        );
    }
}
