
import { connectDB } from "@/lib/mongodb";
import events from "@/models/eventModel";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const body = await req.json();

        const name = String(body.name || "").trim();
        const description = String(body.description || "").trim();
        const venue = String(body.venue || "").trim();
        const type = String(body.type || "").trim();
        const date = body.date;
        const status = body.status || "Upcoming";

        if (!name || !description || !venue || !type || !date) {
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

        // Resolve the authenticated account from the database.
        const users = (await import("@/models/userModel")).default;
        const currentUser = await users.findOne({
            email: session.user.email,
        }).select("_id");

        if (!currentUser) {
            return NextResponse.json(
                { message: "User account not found" },
                { status: 404 }
            );
        }

        const newEvent = await events.create({
            name,
            description,
            date: new Date(date),
            venue,
            type,
            status,
            userId: currentUser._id,
        });

        return NextResponse.json(
            {
                message: "Event created successfully",
                data: newEvent,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("CREATE EVENT ERROR:", error);

        return NextResponse.json(
            { message: "Failed to create event" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const users = (await import("@/models/userModel")).default;
        const currentUser = await users.findOne({
            email: session.user.email,
        }).select("_id");

        if (!currentUser) {
            return NextResponse.json(
                { message: "User account not found" },
                { status: 404 }
            );
        }

        const allEvents = await events
            .find({ userId: currentUser._id })
            .sort({ date: 1 });

        return NextResponse.json(
            {
                message: "Events fetched successfully",
                data: allEvents,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("FETCH EVENTS ERROR:", error);

        return NextResponse.json(
            { message: "Failed to fetch events" },
            { status: 500 }
        );
    }
}
