import { toast } from "sonner";
import { useTimerStore } from "@/store/useTimerStore";
import axios from "axios";

export async function startTimer(projectId: string) {
    try {
        const response = await axios.post("/api/timeLogs/start", { projectId });
        if (response.data.success) {
            if(response.data.data.autoStoppedTimeLog) {
                toast.success("Previous timer stopped and new timer started successfully");
            }
            toast.success("Timer started successfully");
            useTimerStore.getState().setActiveTimer({
                id: response.data.data.timeLog._id,
                projectId: response.data.data.timeLog.projectId,
                startTime: response.data.data.timeLog.startTime,
            });
        } else {
            toast.error(response.data.message || "Failed to start timer");
            return null;
        }
    } catch (error: any) {
        console.error("Error starting timer:", error);
        toast.error(error.response?.data?.message || "An error occurred while starting the timer");
        return null;
    }
}

export async function stopTimer() {
    const id = useTimerStore.getState().activeTimer?.id;
    if (!id) {
        toast.error("No active timer to stop");
        return;
    }
    try {
        const response = await axios.patch(`/api/timeLogs/${id}/stop`);
        if (response.data.success) {
            toast.success("Timer stopped successfully");
            useTimerStore.getState().setActiveTimer(null);
        } else {
            toast.error(response.data.message || "Failed to stop timer");
        }
    } catch (error: any) {
        console.error("Error stopping timer:", error);
        toast.error(error.response?.data?.message || "An error occurred while stopping the timer");
    }
}

