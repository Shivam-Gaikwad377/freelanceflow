import React from "react";
import { useState, useEffect } from "react";
import { ITask } from "@/schemas/createTask.schema";
import useFetch from "@/app/hooks/useFetch";
import StatusBadge from "@/components/Invoice/StatusBadge";
import { Check } from "lucide-react";
import axios from "axios";

const TasksTable = ({ projectId }: { projectId: string }) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [tasksTotal, setTasksTotal] = useState<number>(0);
  const [tasksLimit, setTasksLimit] = useState<number>(4);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const {
    data: tasksData,
    loading,
    error,
  } = useFetch(`/api/tasks?projectId=${projectId}&limit=${tasksLimit}`);

  useEffect(() => {
    if (tasksData) {
      setTasks(tasksData?.tasks || []);
      setTasksTotal(tasksData?.total || 0);
    }
  }, [tasksData]);

  const handleDoneChange = async (taskId: string) => {
    const previous = tasks;
    const target = tasks.find((t) => t._id.toString() === taskId);
    if (!target) return;

    const newStatus = target.status === "completed" ? "pending" : "completed";

    // optimistic update, scoped to this one task only
    setTasks((prev) =>
      prev.map((t: any) =>
        t._id.toString() === taskId
          ? {
              ...t,
              status: newStatus,
              completedAt:
                newStatus === "completed" ? new Date().toISOString() : null,
            }
          : t
      )
    );
    setLoadingId(taskId);

    try {
      await axios.patch(`/api/tasks/${taskId}`, {
        status: newStatus,
        completedAt:
          newStatus === "completed" ? new Date().toISOString() : null,
      });
    } catch {
      setTasks(previous); // revert only if the request fails
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-lg card-shadow">
      <div className="flex justify-between items-center mb-md pb-md border-b border-outline-variant/30">
        <h3 className="text-headline-md text-on-surface">Tasks</h3>
        <button className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-sm hover:bg-surface-tint transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-sm" data-icon="add">
            add
          </span>
          Add Task
        </button>
      </div>
      <div className="flex flex-col gap-0">
        <div className="flex items-center justify-between py-3 border-b border-outline-variant/10">
          <div className="flex items-center w-full justify-content flex-col gap-3">
            {tasks.map((task) => (
              <div
                key={task._id.toString()}
                className="flex items-center w-full justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    onClick={() => handleDoneChange(task._id.toString())}
                    className={`w-5.5 h-5.5 font-bold rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer
            ${task.status === "completed" ? "bg-primary border-primary" : "border-gray-300"}
            ${loadingId === task._id.toString() ? "opacity-60 pointer-events-none" : ""}`}
                  >
                    <Check
                      size={14}
                      className={`text-white transition-all ${task.status === "completed" ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
                    />
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-on-surface text-body-lg font-semibold">
                      {task.title}
                    </span>
                    <span className="text-on-surface-variant text-body-sm">
                      {new Date(task.dueDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <StatusBadge
                  color={
                    task.status === "completed"
                      ? "success"
                      : task.status === "pending"
                        ? "normal"
                        : "error"
                  }
                  label={task.status}
                  fontSize="medium"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksTable;
