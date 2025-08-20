import { create } from "zustand";

export const useAdmin = create((set) => ({
  slug: null,
  setSlug: (slug) => set({ slug }),
}));
