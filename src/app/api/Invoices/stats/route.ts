import { NextResponse } from "next/server";
import Invoice from "@/models/invoice.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { isValidObjectId } from "mongoose";
import type { PipelineStage } from "mongoose";
import { connectToDatabase } from "@/lib/dbConfig";
import ApiResponse from "@/types/ApiResponse";

import { markOverdueInvoices } from "@/helpers/markOverdues";
import { invoiceStatsPipeline } from "@/lib/pipelines/invoice.pipeline";
function buildMonthlySeries(rows: { _id: string; total: number }[]) {
  const now = new Date();
  const series: { month: string; total: number }[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth() - i, 1));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const match = rows.find((r) => r._id === key);
    series.push({
      month: d.toLocaleString("en-US", { month: "short", year: "2-digit" }),
      total: match?.total ?? 0,
    });
  }
  return series;
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user._id;
    if (!userId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!isValidObjectId(userId)) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid invoice ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    await markOverdueInvoices(userId);

    const stats = await Invoice.aggregate(
      invoiceStatsPipeline(userId) as PipelineStage[]
    );
    const result = stats[0] ?? {};

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Invoice stats fetched successfully",
        data: {
          outstanding: {
            total: result?.outstanding[0]?.total || 0,
            count: result?.outstanding[0]?.count || 0,
          },
          paidThisMonth: {
            total: result?.paidThisMonth[0]?.total || 0,
            count: result?.paidThisMonth[0]?.count || 0,
          },
          overdue: {
            total: result?.overdue[0]?.total || 0,
            count: result?.overdue[0]?.count || 0,
          },
          paidLastMonth: {
            total: result?.paidLastMonth[0]?.total || 0,
            count: result?.paidLastMonth[0]?.count || 0,
          },
          monthlyRevenue: buildMonthlySeries(result?.monthlyRevenue || []),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while fetching the invoice stats",
      },
      { status: 500 }
    );
  }
}
