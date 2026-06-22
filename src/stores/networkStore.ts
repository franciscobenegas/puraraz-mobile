import { create } from 'zustand';
import { flushQueue } from '@services/syncService';
import { getQueue, getPendingCount } from '@services/offlineQueue';
import type { QueuedOperation } from '@services/offlineQueue';

interface NetworkStore {
  isOnline: boolean;
  pendingCount: number;
  pendingOperations: QueuedOperation[];
  isSyncing: boolean;
  setOnline: (online: boolean) => void;
  refreshPendingCount: () => Promise<void>;
  sync: () => Promise<void>;
}

export const useNetworkStore = create<NetworkStore>((set, get) => ({
  isOnline: true,
  pendingCount: 0,
  pendingOperations: [],
  isSyncing: false,

  setOnline: (isOnline) => set({ isOnline }),

  refreshPendingCount: async () => {
    const pendingOperations = await getQueue();
    set({ pendingCount: pendingOperations.length, pendingOperations });
  },

  sync: async () => {
    if (get().isSyncing) return;
    const count = await getPendingCount();
    if (count === 0) return;

    set({ isSyncing: true });
    try {
      await flushQueue();
    } finally {
      const pendingOperations = await getQueue();
      set({ pendingCount: pendingOperations.length, pendingOperations, isSyncing: false });
    }
  },
}));
