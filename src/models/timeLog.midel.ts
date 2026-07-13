import { time } from "console";
import mongoose from "mongoose"

export interface ITimeLog extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    startTime: Date;
    endTime: Date;
    duration: number; // in seconds
    
    source: "manual" | "automatic";
    status: "active"  | "completed";
}

const timeLogSchema = new mongoose.Schema<ITimeLog>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        default: null,
    },
    duration: { 
        type: Number,
        default: 0,
    },
    source: {
        type: String,
        enum: ["manual", "automatic"],
        default: "manual",
    },
    status: {
        type: String,
        enum: ["active", "completed"],
        default: "active",
    },
},{timestamps: true});
timeLogSchema.index({ userId: 1, projectId: 1, startTime: 1 });
timeLogSchema.index({ userId: 1, projectId: 1, duration: 1 });
timeLogSchema.index({ userId: 1, projectId: 1, source: 1 });

export const TimeLog = mongoose.model<ITimeLog>("TimeLog", timeLogSchema);
