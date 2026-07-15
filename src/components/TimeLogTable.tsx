import React, { useState, useEffect } from "react";
import SecondaryButton from "./SecondaryButton";
import useFetch from "@/app/hooks/useFetch";
import AddTimeLog from "./AddTimeLog";
import ConfirmationBox from "./confirmationBox";
import axios from "axios";
import { toast } from "sonner";

const TimeLogTable = ({ projectId }: { projectId: string }) => {
  const [timeLogs, setTimeLogs] = useState<any[]>([]);
  const [timeLogsLimit, setTimeLogsLimit] = useState<number>(5);
  const [timeLogsTotal, setTimeLogsTotal] = useState<number>(0);
  const [showAddTimeLog, setShowAddTimeLog] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const [timeLogId, setTimeLogId] = useState<string>("");

  const {
    data: data,
    error,
    loading,
  } = useFetch(
    `/api/timeLogs?offset=0&limit=${timeLogsLimit}&projectId=${projectId}`
  );

  useEffect(() => {
    if (data) {
      setTimeLogs(data.timeLogs ?? []);
      setTimeLogsTotal(data.total ?? 0);
    }
  }, [data]);
  const handeleDelete = async (timeLogId: string) => {
    try {
      const response = await axios.delete(`/api/timeLogs/${timeLogId}`);
      if (response.data.success) {
        setTimeLogs((prevTimeLogs) =>
          prevTimeLogs.filter((timeLog) => timeLog._id !== timeLogId)
        );
        toast.success("Time log deleted successfully");
        setTimeLogsTotal((prevTotal) => prevTotal - 1);
      }
    } catch (error) {
      console.error("Error deleting time log:", error);
      toast.error("Failed to delete time log");
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden card-shadow">
      <div className="p-md flex justify-between items-center border-b border-outline-variant/30">
        <h3 className="font-label-md text-on-surface font-semibold">
          Time Logs Summary
        </h3>
        <SecondaryButton
          label="Add Time Log"
          onClick={() => setShowAddTimeLog(true)}
          icon="add"
          fontSize="small"
        />
      </div>
      <table className="w-full text-left border-collapse">
        <thead className="bg-surface-container-low text-on-surface-variant text-label-sm border-b border-outline-variant/30">
          <tr>
            <th className="p-3 font-semibold">Start Time</th>
            <th className="p-3 font-semibold">Duration</th>
            <th className="p-3 font-semibold">Source</th>
            <th className="p-3 font-semibold"></th>
          </tr>
        </thead>
        <tbody className="text-body-sm text-on-surface">
          {timeLogs?.map((timeLog) => (
            <tr
              key={timeLog?._id.toString()}
              className=" group border-b  hover:bg-surface-container/50 border-outline-variant/10  transition-colors"
            >
              <td className="p-3  font-label-md text-on-surface font-medium">
                {new Date(timeLog?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>

              <td className="p-3 ">
                {(Math.floor(timeLog?.duration) / 3600).toFixed(2)} hours
              </td>
              <td className="p-3 capitalize font-medium text-on-surface">
                {timeLog?.source}
              </td>
              <td className="p-3">
                <span
                  onClick={() => {
                    setTimeLogId(timeLog._id);
                    setShowDeleteConfirmation(true);
                  }}
                  className="material-symbols-outlined group-hover:opacity-100 opacity-0 cursor-pointer hover:text-primary"
                >
                  delete
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-md text-center">
        {timeLogs?.length === timeLogsTotal ? (
          <button
            onClick={() => setTimeLogsLimit(5)}
            className="text-label-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            View Less
          </button>
        ) : (
          <button
            onClick={() => setTimeLogsLimit(timeLogsTotal)}
            className="text-label-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            View All Time Logs
          </button>
        )}
      </div>
      {showAddTimeLog && (
        <AddTimeLog
          projectId={projectId}
          onClose={() => setShowAddTimeLog(false)}
        />
      )}
      {showDeleteConfirmation && (
        <ConfirmationBox
          message="Are you sure you want to delete this time log?"
          onConfirm={async () => {
            // Assuming you have a function to handle the actual deletion
            handeleDelete(timeLogId);
            setShowDeleteConfirmation(false);
          }}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </div>
  );
};

export default TimeLogTable;
