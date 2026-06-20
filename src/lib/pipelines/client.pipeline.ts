
export const clientTotalBilledPipeline = [
  {
    $lookup: {
      from: "invoices",
      localField: "_id",
      foreignField: "clientID",
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