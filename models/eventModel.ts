import mongoose from "mongoose";

interface event {
  name: string;
  description: string;
  date: Date;
  venue: string;
  type: string;
  status: string;
}

const eventSchema = new mongoose.Schema<event>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

export default mongoose.models.events ||
  mongoose.model<event>("events", eventSchema);
