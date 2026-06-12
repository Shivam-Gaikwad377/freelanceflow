import mongoose from "mongoose";

export interface IInvoice extends mongoose.Document {
    invoiceNumber: number;
    owner: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    amount: number;
    dueDate: Date;
    status: "pending" | "paid" | "overdue";
    lineItems: {
        description: string;
        quantity: number;
        price: number;
    }[];
    client: mongoose.Types.ObjectId;
}

const invoiceSchema = new mongoose.Schema<IInvoice>({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    invoiceNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },  
    status: {
        type: String,
        enum: ["pending", "paid", "overdue"],
        default: "pending",
    },
    lineItems: [
        {
            description: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
    },
}, {timestamps: true});

export default mongoose.model<IInvoice>("Invoice", invoiceSchema);