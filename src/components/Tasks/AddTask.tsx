import React, { useEffect } from "react";
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";

import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema } from "@/schemas/createTask.schema";
import { toast } from "sonner";
import axios from "axios";
import { TaskInput, TaskOutput } from "@/schemas/createTask.schema";
import StatusBadge from "../Invoice/StatusBadge";
type AddTaskProps = {
  projectId: string;
  onClose: () => void;
};
const AddTask = ({ projectId, onClose }: AddTaskProps) => {
  const form = useForm<TaskInput, unknown, TaskOutput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      priority: "low",
      dueDate: new Date().toISOString().split("T")[0],
      status: "pending",
      projectId: projectId,
    },
  });
  // useEffect(() => {
  //   form.reset({
  //     title: "",
  //     priority: "low",
  //     dueDate: new Date().toISOString().split("T")[0],
  //     status: "pending",
  //     projectId: projectId,
  //   })
  // }, [projectId, form]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const onSubmit = async (data: TaskOutput) => {
    try {
      const response = await axios.post("/api/tasks", data);
      if (response.data.success) {
        toast.success("Task added successfully");
        onClose(); // Call the onClose function to close the modal
      } else {
        toast.error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
    }
  };
  const onInvalid = (formErrors: typeof errors) => {
    console.error("Task form validation failed:", formErrors);
  };

  return (
    <div className=" inset-0 flex items-center justify-center h-screen fixed bg-black/40 rounded-xl z-50">
      <div
        className="bg-surface border border-outline-variant/40 rounded-xl p-lg flex flex-col items-center gap-sm w-auto h-auto"
        onClick={(e) => e.stopPropagation()} // add this
      >
        <h3 className="text-headline-md text-on-surface">Add Task</h3>
        <div
          className="space-y-lg"
        >
          <div className="flex  gap-md">
            <div className="flex flex-col gap-1">
              <label htmlFor="title" className="text-body-md text-on-surface">
                Title
              </label>
              <input
                id="title"
                {...register("title")}
                className="form-input-text"
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="text-error text-body-sm">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-body-md text-on-surface" htmlFor="dueDate">
                Due Date
              </label>
              <input
                id="dueDate"
                {...register("dueDate")}
                className="form-input-text"
                type="date"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 justify-between ">
            <label className="text-body-md text-on-surface mb-sm">
              Priority
            </label>
            <div className="flex flex-col items-left gap-xl">
              <label className="flex items-center gap-md cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    className="form-input-radio peer"
                    value="high"
                    type="radio"
                    {...register("priority", {
                      required: "Please select a priority",
                    })}
                  />
                  <div className="absolute w-3 h-3 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                </div>
                <StatusBadge color="error" fontSize="medium" label="high" />
              </label>
              <label className="flex items-center gap-md cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    className="form-input-radio peer"
                    value="medium"
                    type="radio"
                    {...register("priority", {
                      required: "Please select a priority",
                    })}
                  />
                  <div className="absolute w-3 h-3 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                </div>
                <StatusBadge color="normal" fontSize="medium" label="medium" />
              </label>
              <label className="flex items-center gap-md cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    className="form-input-radio peer"
                    value="low"
                    type="radio"
                    {...register("priority", {
                      required: "Please select a priority",
                    })}
                  />
                  <div className="absolute w-3 h-3 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                </div>
                <StatusBadge color="success" fontSize="medium" label="low" />
              </label>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-md">
            <PrimaryButton
              label="Add Task"
              onClick={handleSubmit(onSubmit, onInvalid)}
            />
            <SecondaryButton
              icon=""
              fontSize="medium"
              label="Cancel"
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
