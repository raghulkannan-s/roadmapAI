import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: {
        provider_id: null,
        name: null,
        email: null,
        image: null
      },
      setUser: (user) => set({ user : user }),
      clearUser: () => set({ user: {
        provider_id: null,
        name: null,
        email: null,
        image: null
      } }),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
