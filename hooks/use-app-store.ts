import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;

  recents: string[];
  addRecent: (slug: string) => void;
}

const MAX_RECENTS = 6;

/**
 * Favorites and recently-used tools, persisted to localStorage so they
 * survive a refresh. Theme lives separately in next-themes (see providers.tsx)
 * since it needs to be readable before hydration to avoid a flash.
 */
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (slug) =>
        set((state) => ({
          favorites: state.favorites.includes(slug)
            ? state.favorites.filter((s) => s !== slug)
            : [...state.favorites, slug],
        })),
      isFavorite: (slug) => get().favorites.includes(slug),

      recents: [],
      addRecent: (slug) =>
        set((state) => ({
          recents: [slug, ...state.recents.filter((s) => s !== slug)].slice(0, MAX_RECENTS),
        })),
    }),
    { name: "toolbox-storage" }
  )
);
