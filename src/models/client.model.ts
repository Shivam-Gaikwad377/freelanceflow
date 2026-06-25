import mongoose from "mongoose";

export interface IClient extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "active" | "inactive";
  userId: mongoose.Types.ObjectId;
  description?: string;
}

const clientSchema = new mongoose.Schema<IClient>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
  },
});

clientSchema.index({ email: 1, userId: 1 }, { unique: true });
clientSchema.index({ phone: 1, userId: 1 }, { unique: true });
clientSchema.index({ userId: 1, createdAt: -1 });
clientSchema.index({ userId: 1, status: 1 });
const ClientModel =
  (mongoose.models.Client as mongoose.Model<IClient>) ||
  mongoose.model<IClient>("Client", clientSchema);

export default ClientModel;
