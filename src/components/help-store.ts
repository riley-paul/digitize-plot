import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = {
  showHelp: boolean;
  setShowHelp: (state: boolean) => void;
};

const useHelpStore = create<Store>()(
  persist(
    (set) => ({
      showHelp: true,
      setShowHelp: (state) => set({ showHelp: state }),
    }),
    { name: "help-store" },
  ),
);

export default useHelpStore;
