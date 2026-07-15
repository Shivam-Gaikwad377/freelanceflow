import { PipelineStage } from "mongoose";

export const BurnRateCalculationPipeline: PipelineStage[] = [
  {
    $lookup: {
      from: "timelogs",
      localField: "_id",
      foreignField: "projectId",
      as: "timelogs",
    },
  },
  {
    $addFields: {
      burnRate: {
        $multiply: [
          { $divide: [{ $sum: "$timelogs.duration" }, 3600] },
          "$hourlyRate",
        ],
      },
    },
  },
  { $project: { timelogs: 0, userId: 0 } },
];

export const PopulateClientPipeline: PipelineStage[] = [
  {
    $lookup: {
      from: "clients",
      localField: "clientId", // Look at the project's clientId
      foreignField: "_id",    // Match it to the client's _id
      as: "clientId",       // Output to a new field to avoid confusion
    },
  },
  {
    $unwind: {
      path: "$clientId",
      // IMPORTANT: Keeps the project in the results even if the client isn't found
      preserveNullAndEmptyArrays: true, 
    },
  },
  {
    // Instead of $project (which drops all other project fields),
    // we just remove the specific client fields we don't want to send to the frontend.
    $unset: [
      // Example of things to hide
      "clientId.createdAt",
      "clientId.updatedAt",
      "clientId.__v"
    ]
  }
];