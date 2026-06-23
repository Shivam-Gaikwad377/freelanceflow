import { create } from "zustand";

interface preFillClient {
    name: string;
    id: string;
}
interface UiState{
    isAddProjectOpen: boolean;
    prefillClient: preFillClient | null;
    openAddProject: (prefillClient: preFillClient | null) => void;
    closeAddProject: () => void;
}

export const useUiStore = create<UiState>((set) => ({
    isAddProjectOpen: false,
    prefillClient: null,
    openAddProject: (prefillClient: preFillClient | null) => set({ isAddProjectOpen: true, prefillClient }),
    closeAddProject: () => set({ isAddProjectOpen: false, prefillClient: null }),
}));