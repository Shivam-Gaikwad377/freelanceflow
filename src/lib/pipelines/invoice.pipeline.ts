import mongoose from "mongoose";

const STATUS = { PENDING: "pending", PAID: "Paid", OVERDUE: "overdue" } as const;
// ^ single source of truth — casing drift across facets is exactly what broke the original

export const invoiceStatsPipeline = (ownerID: string) => {
  const now = new Date();
  const startOfThisMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  const startOfLastMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 1, 1));
  const twelveMonthsAgo = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 11, 1));

  return [
    { $match: { userId: new mongoose.Types.ObjectId(ownerID) } },
    {
      $facet: {
        outstanding: [
          { $match: { status: STATUS.PENDING } },
          { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
        ],
        overdue: [
          { $match: { status: STATUS.OVERDUE } },
          { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
        ],
        paidThisMonth: [
          { $match: { status: STATUS.PAID, paidAt: { $gte: startOfThisMonth } } },
          { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
        ],
        paidLastMonth: [
          {
            $match: {
              status: STATUS.PAID,
              paidAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
        ],
        monthlyRevenue: [
          { $match: { status: STATUS.PAID, paidAt: { $gte: twelveMonthsAgo } } }, // bound the scan
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m", date: "$paidAt", timezone: "UTC" } },
              total: { $sum: "$amount" },
            },
          },
          { $sort: { _id: 1 } }, // ascending — chronological order, no client-side re-sort needed
        ],
        InvoicesDueThisWeek: [
          {
            $match: {
              status: { $in: [STATUS.PENDING, STATUS.OVERDUE] },
              dueDate: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)), $lt: new Date() }
            }
          },
          { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
        ],
      },
    },
  ];
};