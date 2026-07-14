import mongoose from "mongoose";

export interface IProject extends mongoose.Document {
  clientId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  status: "open" | "in progress" | "completed";
  userId?: mongoose.Types.ObjectId;
  client?: string;
  isStarted?: boolean;
  StartedAt?: Date;
  hourlyRate?: number;
}

const projectSchema = new mongoose.Schema<IProject>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in progress", "completed"],
      default: "open",
    },
    deadline: {
      type: Date,
      required: true,
    },
    
    StartedAt: {
      type: Date,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: false,
    },
    client: {
      type: String,
      required: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ userId: 1, status: 1 });
const ProjectModel =
  (mongoose.models.Project as mongoose.Model<IProject>) ||
  mongoose.model<IProject>("Project", projectSchema);

export default ProjectModel;
