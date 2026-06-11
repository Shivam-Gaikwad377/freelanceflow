import mongoose from "mongoose";

export interface IClient extends mongoose.Document {
    name: string;
    email: string;
    phone: string;
    company: string;
    status: "active" | "inactive";
    userId: mongoose.Types.ObjectId;
}

const clientSchema = new mongoose.Schema<IClient>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
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
});
export default mongoose.model<IClient>("Client", clientSchema);