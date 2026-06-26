import mongoose from "mongoose";


export const invoiceStatsPipeline = (ownerID: string) => [
  { $match: { userId: new mongoose.Types.ObjectId(ownerID) } },
  {
    $facet: {
      outstanding: [
        { $match: { status: "pending" } },
        {
          $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } },
        },
      ],
      paidThisMonth: [
        {
          $match: {
            status: "paid",
            paidAt: {
              $gte: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
              ),
              $lt: new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                1
              ),
            },
          },
        },
        {
          $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } },
        },
      ],
      overdue: [
        { $match: { status: "overdue" } },
        {
          $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } },
        },
      ],
    },
  },
];
