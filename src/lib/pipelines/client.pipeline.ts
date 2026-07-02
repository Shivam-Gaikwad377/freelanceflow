
export const clientTotalBilledPipeline = [
  {
    $lookup: {
      from: "invoices",
      localField: "_id",
      foreignField: "clientId",
      as: "invoices",
    },
  },
  {
    $addFields: {
      totalBilled: { $sum: "$invoices.amount" },
    },
  },
  { $project: { invoices: 0, userId: 0 } },
];