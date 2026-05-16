import { create } from "zustand";
import i18n from "../I18n/I18n";

export interface TerminalLogEntry {
  id: string;
  level: "info" | "success" | "warning" | "error";
  message: string;
}

export interface TerminalStoreState {
  entries: TerminalLogEntry[];
  pushEntry: (entry: Omit<TerminalLogEntry, "id">) => void;
  clearEntries: () => void;
}

export const useTerminalStore = create<TerminalStoreState>((set) => ({
  entries: [
    {
      id: "boot",
      level: "info",
      message: i18n.t("terminal.initialized"),
    },
  ],

  pushEntry: (entry) => {
    set((state) => ({
      entries: [
        ...state.entries,
        {
          id: `${Date.now()}-${state.entries.length}`,
          ...entry,
        },
      ],
    }));
  },

  clearEntries: () => {
    set({ entries: [] });
  },
}));
