"use client";
import { useEffect } from "react";
import axios from "axios";
import { useTimerStore } from "@/store/useTimerStore";

export default function TimerHydrator() {
  useEffect(() => {
    async function hydrate() {
      try {
        const { data } = await axios.get("/api/timeLogs/start");
        if (data?.activeTimer) {
          useTimerStore.getState().setActiveTimer(data.activeTimer);
        }
      } catch (err) {
        console.error("Failed to hydrate active timer:", err);
      }
    }
    hydrate();
  }, []);

  return null;
}