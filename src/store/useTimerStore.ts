// store/useTimerStore.ts
import { create } from 'zustand';

export interface ActiveTimer {
  id: string;
  projectId: string;
  startTime: string; // ISO string, straight from the server
}

interface TimerStore {
  activeTimer: ActiveTimer | null;
  setActiveTimer: (timer: ActiveTimer | null) => void;
}

export const useTimerStore = create<TimerStore>((set) => ({
  activeTimer: null,
  setActiveTimer: (timer) => set({ activeTimer: timer }),
}));