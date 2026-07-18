import mongoose from "mongoose";
export type Client = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "active" | "inactive";
  userId: mongoose.Types.ObjectId;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  totalBilled?: number;
};

export type Project = {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  status: "open" | "in progress" | "completed";
  clientId?: string;
  client: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  StartedAt?: Date;
  hourlyRate?: number;
  burnRate?: number;
};

export type TimeLog = {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  source?: "manual" | "automatic";
  status?: "active" | "completed";
};

export type Invoice = {
  _id: mongoose.Types.ObjectId;
  invoiceNumber?: number;
  projectId: string;
  clientId: string;
  issueDate: Date;
  dueDate: Date;
  amount: number;
  status?: "pending" | "Paid" | "overdue";
  lineItems: {
    description: string;
    quantity: number;
    price: number;
  }[];
  project: string;
  client: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  taxRate: number;
  paidAt?: Date;
};

export type Task = {
  _id: mongoose.Types.ObjectId;
  projectId: string;
  title: string;
  priority: "low" | "medium" | "high";
  dueDate: Date;
  status: "pending" | "completed" | "overdue";
  completedAt?: Date;
};
