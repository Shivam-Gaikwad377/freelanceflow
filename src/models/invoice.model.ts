import mongoose from "mongoose";

export interface IInvoice extends mongoose.Document {
    invoiceNumber: number;
    userId: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    amount: number;
    dueDate: Date;
    status: "pending" | "paid" | "overdue";
    lineItems: {
        description: string;
        quantity: number;
        price: number;
    }[];
    clientId: mongoose.Types.ObjectId;
    client: string;
    paidAt?: Date;
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
    userId: {
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
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
    },
    client: {
        type: String,
        required: true,
    },
    paidAt: {
        type: Date,
    }
}, {timestamps: true});
invoiceSchema.index({ userId: 1, createdAt: -1 });
invoiceSchema.index({ userId: 1, status: 1 });
invoiceSchema.index({ userId: 1, clientId: 1 });
const InvoiceModel =
  (mongoose.models.Invoice as mongoose.Model<IInvoice>) ||
  mongoose.model<IInvoice>("Invoice", invoiceSchema);

export default InvoiceModel;