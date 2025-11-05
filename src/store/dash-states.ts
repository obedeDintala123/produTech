import { type BoardType, type NoteType } from "@/lib/types";
import { persist } from "zustand/middleware";
import { create } from "zustand";

type RecentActivityType = {
  recentBoards: BoardType[];
  recentNotes: NoteType[];
  isLoading: boolean;
  setRecentBoards: (boards: BoardType[]) => void;
  setRecentNotes: (notes: NoteType[]) => void;
  setLoading: (loading: boolean) => void;
  clearBoards: () => void;
  clearNotes: () => void;
};

export const useRecentActivityStore = create<RecentActivityType>()(
  persist(
    (set) => ({
      recentBoards: [],
      recentNotes: [],
      isLoading: false,
      clearBoards: () => set({ recentBoards: [] }),
      clearNotes: () => set({ recentNotes: [] }),
      setRecentBoards: (boards) => set({ recentBoards: boards }),
      setRecentNotes: (notes) => set({ recentNotes: notes }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "recent-activity-store",
    }
  )
);
