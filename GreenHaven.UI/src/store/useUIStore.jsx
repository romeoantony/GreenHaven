import { create } from 'zustand';

const useUIStore = create((set) => ({
  shouldFocusSearch: false,
  triggerSearchFocus: () => set({ shouldFocusSearch: true }),
  resetSearchFocus: () => set({ shouldFocusSearch: false }),
}));

export default useUIStore;
