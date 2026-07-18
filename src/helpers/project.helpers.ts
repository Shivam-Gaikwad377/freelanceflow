import axios from "axios";
export const handleStartProject = async (id: string| undefined) => {
  try {
    const response = await axios.patch(`/api/projects/${id}`, {
      StartedAt: new Date(),
      status: "in progress",
    });
    return response.data.data;
  } catch (error) {
    console.error("Error starting project:", error);
  }
};
export const handleMarkAsDone = async (id: string| undefined) => {
  try {
    const response = await axios.patch(`/api/projects/${id}`, {
      status: "completed",
    });
    return response.data.data;
  } catch (error) {
    console.error("Error marking project as done:", error);
  }
};
