import { create } from "zustand";

type ModalType = "addProject" | "addInvoice" | null;

interface PrefillClient {
  name: string;
  id: string;
}

interface PrefillProject {
  name: string;
  id: string;
  clientId?: string;
}

interface ModalContext {
  prefillClient?: PrefillClient | null;
  prefillProject?: PrefillProject | null;
}

interface UiState {
  activeModal: ModalType;
  modalContext: ModalContext;
  openModal: (modal: ModalType, context?: ModalContext) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeModal: null,
  modalContext: {},
  openModal: (modal, context = {}) => set({ activeModal: modal, modalContext: context }),
  closeModal: () => set({ activeModal: null, modalContext: {} }),
}));