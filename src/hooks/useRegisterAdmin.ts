import { create } from "zustand";

interface RegisterAdminState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useRegisterAdmin = create<RegisterAdminState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useRegisterAdmin;
