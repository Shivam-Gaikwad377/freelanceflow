import React from "react";
import { useState, useEffect } from "react";
import { Task } from "@/types/Model.types";
import useFetch from "@/app/hooks/useFetch";
import StatusBadge from "@/components/Invoice/StatusBadge";
import { Check } from "lucide-react";
import axios from "axios";
import AddTask from "./AddTask";
import SecondaryButton from "../SecondaryButton";
import { set } from "mongoose";
import ConfirmationBox from "../confirmationBox";
import { toast } from "sonner";

const TasksTable = ({ projectId }: { projectId: string }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksTotal, setTasksTotal] = useState<number>(0);
  const [tasksLimit, setTasksLimit] = useState<number>(4);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);
  const [showconfirmDeleteModal, setShowConfirmDeleteModal] =
    useState<boolean>(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<string>("");
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
  const handleDelete = async (id: string) => {
    try {
      // Call the API to delete the task
      const response = await axios.delete(`/api/tasks/${id}`);
      if (response.status === 200) {
        // If the deletion is successful, update the tasks state
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id.toString() !== id)
        );
        setTasksTotal((prevTotal) => prevTotal - 1); // Decrease the total count
        toast.success("Task deleted successfully.");
      } else {
        console.error("Failed to delete task:", response.statusText);
        toast.error("Failed to delete task. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-lg card-shadow">
      <div className="flex justify-between items-center mb-md pb-md border-b border-outline-variant/30">
        <h3 className="text-headline-md text-on-surface">Tasks</h3>
        <SecondaryButton
          label="Add Task"
          onClick={() => {
            setShowAddTaskModal(true);
          }}
          icon="add"
          fontSize="medium"
        />
      </div>
      <div className="flex flex-col gap-0">
        <div className="flex items-center justify-between py-3 border-b border-outline-variant/10">
          <div className="flex  items-center w-full justify-content flex-col gap-3">
            {tasks.map((task) => (
              <div
                key={task._id.toString()}
                className="group flex items-center w-full justify-between gap-3 "
              >
                <div className="flex items-center justify-between w-full">
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
                      <span className="text-on-surface flex items-center justify-center gap-2 text-body-lg font-semibold">
                        {task.title}
                        <StatusBadge
                          color={
                            task.priority === "high"
                              ? "error"
                              : task.priority === "medium"
                                ? "normal"
                                : "success"
                          }
                          label={task.priority}
                          fontSize="small"
                        />
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
                <div className=" px-2 flex items-center justify-center gap-2">
                  <span className="group-hover:opacity-100 opacity-0 transition-all cursor-pointer duration-200 hover:text-primary  material-symbols-outlined text-on-surface-variant group-hover:text-on-surface">
                    edit
                  </span>
                  <span
                    onClick={() => {
                      setTaskIdToDelete(task._id.toString());
                      setShowConfirmDeleteModal(true);
                    }}
                    className="group-hover:opacity-100 opacity-0 transition-all cursor-pointer duration-200 hover:text-primary  material-symbols-outlined text-on-surface-variant group-hover:text-on-surface"
                  >
                    delete
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className=" text-center">
          {tasks.length === tasksTotal ? (
            <button
              onClick={() => setTasksLimit(4)}
              className="text-label-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              View Less
            </button>
          ) : (
            <button
              onClick={() => setTasksLimit(tasksTotal)}
              className="text-label-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              View All Tasks
            </button>
          )}
        </div>
      </div>
      {showAddTaskModal && (
        <AddTask
          projectId={projectId}
          onClose={() => setShowAddTaskModal(false)}
        />
      )}
      {showconfirmDeleteModal && (
        <ConfirmationBox
          message="Are you sure you want to delete this task?"
          onConfirm={async () => {
            await handleDelete(taskIdToDelete);
            setShowConfirmDeleteModal(false);
          }}
          onCancel={() => setShowConfirmDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default TasksTable;
