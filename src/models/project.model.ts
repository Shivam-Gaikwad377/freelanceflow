import mongoose from "mongoose";


export interface IProject extends mongoose.Document {
    clientID : mongoose.Types.ObjectId;
    title: string;
    description: string;
    budget: number;
    deadline: Date;
    status: "open" | "in progress" | "completed";
    Owner?: mongoose.Types.ObjectId;
    client?: string;
    isStarted?: boolean;
    StartedAt?: Date;
    
}

const projectSchema = new mongoose.Schema<IProject>({
    clientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: false,
    },
    client:{
        type: String,
        required: true,
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
    deadline: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["open", "in progress", "completed"],
        default: "open",
    },
    Owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    isStarted: {
        type: Boolean,
        default: false,
    },
    StartedAt: {
        type: Date,
    },
}, {timestamps: true});

const ProjectModel =
  (mongoose.models.Project as mongoose.Model<IProject>) ||
  mongoose.model<IProject>("Project", projectSchema);

export default ProjectModel;