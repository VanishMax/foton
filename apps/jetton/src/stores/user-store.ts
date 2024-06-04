import { create } from 'zustand';
import { walletClient } from '../ton-clients.ts';

export interface UserStore {
  address: string | undefined;
  loading: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  monitorAuth: VoidFunction;
  activeSection: 'create' | 'minters' | 'manage';
  changeSection: (section: 'create' | 'minters' | 'manage') => void;
}

export const useUserStore = create<UserStore>()((set) => ({
  address: undefined,
  loading: false,
  activeSection: 'create',
  connect: async () => {
    set({ loading: true });
    await walletClient.connect();
    set({ loading: false });
  },
  disconnect: async () => {
    set({ loading: true });
    await walletClient.disconnect();
    set({ loading: false, activeSection: 'create' });
  },
  monitorAuth: () => {
    walletClient.connection.onStatusChange((wallet) => {
      if (wallet) {
        set({ address: wallet.account.address });
      } else {
        set({ address: undefined });
      }
    });
  },
  changeSection: (section) => {
    set({ activeSection: section });
  },
}));
