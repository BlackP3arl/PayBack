import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  darkMode: boolean | null;
  setDarkMode: (dark: boolean | null) => void;
  initialized: boolean;
  setInitialized: (initialized: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      darkMode: null,
      setDarkMode: (dark) => set({ darkMode: dark }),
      initialized: false,
      setInitialized: (initialized) => set({ initialized }),
    }),
    {
      name: 'payback-app-settings',
    }
  )
);
