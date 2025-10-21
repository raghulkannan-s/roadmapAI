import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: {
        provider_id: null,
        name: null,
        email: null,
        image: null,
        limit: 0,
      },
      setUser: (user) => set({ user }),
      setLimit: (limit) =>
        set((state) => ({
          user: { ...state.user, limit },
        })),
      clearUser: () =>
        set({
          user: {
            provider_id: null,
            name: null,
            email: null,
            image: null,
            limit: 0,
          },
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);

export default useAuthStore;