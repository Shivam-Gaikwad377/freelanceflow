import mongoose from "mongoose";

export interface ITask extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  title: string;
  priority: "low" | "medium" | "high";
  dueDate: Date;
  status: "pending" | "completed" | "overdue";
  completedAt?: Date;
}

export const taskSchema = new mongoose.Schema<ITask>({
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
  title: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "overdue"],
    default: "pending",
  },
  completedAt: {
    type: Date,
    default: null,
  },
},{timestamps: true});

taskSchema.index({ userId: 1, projectId: 1, title: 1 });
taskSchema.index({ userId: 1, projectId: 1, dueDate: 1 });
taskSchema.index({ userId: 1, projectId: 1, status: 1 });
taskSchema.index({ userId: 1, projectId: 1, priority: 1 });
const Task =
  (mongoose.models.Task as mongoose.Model<ITask>) ||
  mongoose.model<ITask>("Task", taskSchema);
export default Task;
