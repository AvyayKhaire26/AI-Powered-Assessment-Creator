import { create } from "zustand";
import { api } from "@/lib/api";
import { Assignment, CreateAssignmentDTO } from "@/types";

interface AssignmentState {
  assignments: Assignment[];
  current: Assignment | null;
  isLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  create: (data: CreateAssignmentDTO) => Promise<Assignment>;
  remove: (id: string) => Promise<void>;
  regenerate: (id: string) => Promise<void>;
  requestPdf: (id: string) => void;
  setCurrent: (a: Assignment) => void;
  clearError: () => void;
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  assignments: [],
  current: null,
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const assignments = await api.assignments.getAll();
      set({ assignments });
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const current = await api.assignments.getById(id);
      set({ current });
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  create: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const assignment = await api.assignments.create(data);
      set((s) => ({ assignments: [assignment, ...s.assignments] }));
      return assignment;
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  remove: async (id) => {
    try {
      await api.assignments.delete(id);
      set((s) => ({ assignments: s.assignments.filter((a) => a._id !== id) }));
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  regenerate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await api.assignments.regenerate(id);
      set({ current: updated });
    } catch (e: any) {
      set({ error: e.message });
      throw e; // ← rethrow so output page can show error banner
    } finally {
      set({ isLoading: false });
    }
  },

  // Opens PDF stream directly — browser handles download natively
  requestPdf: (id) => {
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/assignments/${id}/pdf`,
      "_blank"
    );
  },

  setCurrent: (a) => set({ current: a }),
  clearError: () => set({ error: null }),
}));
