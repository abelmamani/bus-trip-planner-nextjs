import { RecentItem } from '@/models/recent.item';
import { create } from 'zustand';

type RecentItemState = {
  recentItems: RecentItem[];
  addItem: (item: RecentItem) => void;
  clearItems: () => void;
};

const loadInitialState = (): RecentItem[] => {
  if (typeof window === 'undefined') return []; 
  const stored = localStorage.getItem('history');
  return stored ? JSON.parse(stored) : [];
};

export const useItemStore = create<RecentItemState>((set, get) => ({
  recentItems: loadInitialState(),
  addItem: (item: RecentItem) => {
    const existing = get().recentItems;
    let updated = [item, ...existing];

    localStorage.setItem('history', JSON.stringify(updated));
    set({ recentItems: updated });
  },

  clearItems: () => {
    localStorage.removeItem('history');
    set({ recentItems: [] });
  },
}));
