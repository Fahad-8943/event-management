
import mongoose, { Types } from "mongoose";

export type EventStatus = "Upcoming" | "Completed" | "Cancelled";

export interface EventDocument {
    name: string;
    description: string;
    date: Date;
    venue: string;
    type: string;
    status: EventStatus;
    userId: Types.ObjectId;
}

const eventSchema = new mongoose.Schema<EventDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: Date,
            required: true,
        },
        venue: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["Upcoming", "Completed", "Cancelled"],
            default: "Upcoming",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.events ||
    mongoose.model<EventDocument>("events", eventSchema);
