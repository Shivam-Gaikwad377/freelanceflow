import ApiResponse from "@/types/ApiResponse";
import { NextResponse } from "next/server";
import Invoice from "@/models/invoice.model";
import TimeLog from "@/models/timeLog.model";
import { ITimeLog } from "@/schemas/createTimeLog.schema";
import { IInvoice } from "@/schemas/createInvoice.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { connectToDatabase } from "@/lib/dbConfig";
export type ActivityItem = {
  id: string;
  type: "timelog" | "invoice";
  timestamp: Date;
  message: string;
  href: string;
};
export const GET = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    const ownerID = session?.user?._id;
    if (!ownerID || !session) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const [logs, invoices] = await Promise.all([
      TimeLog.find({ userId: ownerID, status: "completed" })
        .sort({ endTime: -1 })
        .limit(10)
        .populate("projectId", "title")
        .lean(),
      Invoice.find({ userId: ownerID, status: "Paid" })
        .sort({ paidAt: -1 })
        .limit(10)
        .populate("clientId", "name")
        .lean(),
    ]);
    if (!logs || !invoices) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "No recent activities found" },
        { status: 404 }
      );
    }
    const completedLogs = logs.filter(
      (log): log is typeof log & { endTime: Date } => log.endTime != null
    );
    const datedInvoices = invoices.filter(
      (inv): inv is typeof inv & { paidAt: Date } => inv.paidAt != null
    );

    const logItems: ActivityItem[] = completedLogs.map((log) => ({
      id: log._id.toString(),
      type: "timelog",
      timestamp: log.endTime, // Date, not Date | undefined — no assertion needed
      message: `Logged time on ${log.projectId?.title ?? "Unknown project"}`,
      href: `/projects/${log.projectId?._id}`,
    }));

    const invoiceItems: ActivityItem[] = datedInvoices.map((inv) => ({
      id: inv._id.toString(),
      type: "invoice",
      timestamp: inv.paidAt,
      message: `Invoice paid — ${inv.client ?? "Unknown client"}`,
      href: `/invoices/${inv._id}`,
    }));
    const feed = [...logItems, ...invoiceItems]
      .sort((a, b) => (b.timestamp as any )- (a.timestamp as any))
      .slice(0, 10);
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Recent activities fetched successfully",
        data: feed,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
