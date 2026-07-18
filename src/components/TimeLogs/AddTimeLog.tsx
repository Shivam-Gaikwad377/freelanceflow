import React, { useEffect } from "react";
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";
import { ITask } from "@/schemas/createTask.schema";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
import {
  ManualTimeLogInput,
  ManualTimeLogOutput,
  manualTimeLogFormSchema,
} from "@/schemas/manualTimeLog.schema";
type AddTimeLogProps = {
  onClose: () => void;
  projectId: string;
};
const AddTimeLog = ({ projectId, onClose }: AddTimeLogProps) => {
  const form = useForm<ManualTimeLogInput, unknown, ManualTimeLogOutput>({
    resolver: zodResolver(manualTimeLogFormSchema),
    defaultValues: {
      projectId: projectId,
      startTime: "",
      endTime: "",
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const onSubmit = async (data: ManualTimeLogOutput) => {
      console.log("submitting:", data.startTime, typeof data.startTime);
    try {
      const response = await axios.post("/api/timeLogs/manual", data);

      if (response.data.success) {
        toast.success("Time log added successfully");
        onClose(); // Call the onClose function to close the modal
      } else {
        toast.error("Failed to add time log");
      }
    } catch (error) {
      console.error("Error adding time log:", error);
      toast.error("Failed to add time log");
    }
  };
  const onInvalid = (formErrors: typeof errors) => {
    console.error("Task form validation failed:", formErrors);
  };
  return (
    <div className=" inset-0 flex flex-col items-center justify-center h-screen fixed bg-black/40 rounded-xl z-50">
      <div
        className="bg-surface border border-outline-variant/40 rounded-xl p-lg flex flex-col items-center gap-sm w-auto h-auto"
        // add this
      >
        <h1 className="text-center text-headline-md ">Add Time Log</h1>
        <div className="w-full flex items-center  gap-md">
          <div className="flex flex-col gap-sm ">
            <label className="font-label-md text-label-md text-on-surface-variant block">
              Start Time
            </label>
            <input
              type="time"
              
              className="form-input-text"
              {...register("startTime")}
            />
            {errors.startTime && (
              <span className="text-error text-label-sm">
                {errors.startTime.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-sm ">
            <label className="font-label-md text-label-md text-on-surface-variant block">
              End Time
            </label>
            <input
              type="time"
              
              className="form-input-text"
              {...register("endTime")}
            />
          </div>
        </div>

        <div className="flex items-center gap-md mt-md">
          <SecondaryButton label="Cancel" onClick={onClose} icon="" />
          <PrimaryButton
            label="Add Time Log"
            onClick={handleSubmit(onSubmit, onInvalid)}
          />
        </div>
      </div>
    </div>
  );
};

export default AddTimeLog;
