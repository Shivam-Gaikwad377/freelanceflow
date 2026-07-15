import { PipelineStage } from "mongoose";

export const BurnRateCalculationPipeline: PipelineStage[] = [
  {
    $lookup: {
      from: "timeLogs",
      localField: "_id",
      foreignField: "projectId",
      as: "timeLogs",
    },
  },
  {
    $addFields: {
      burnRate: {
        $multiply: [
          { $divide: [{ $sum: "$timeLogs.duration" }, 3600] },
          "$hourlyRate",
        ],
      },
    },
  },
  { $project: { timeLogs: 0, userId: 0 } },
];

export const PopulateClientPipeline: PipelineStage[] = [
  {
    $lookup: {
      from: "clients", // the actual collection name (usually lowercase, plural)
      localField: "_id",
      foreignField: "projectId",
      as: "clientId",
    },
  },
  {
    $unwind: "$clientId", // if you expect a single matched doc, not an array
  },
  {
    $project: {
      "clientId.name": 1,
      "clientId.email": 1,
      // ...other fields
    },
  },
];
