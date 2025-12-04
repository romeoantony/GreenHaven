import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (plant) => {
        const cart = get().cart;
        const existingItem = cart.find((item) => item.id === plant.id);

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.id === plant.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { ...plant, quantity: 1 }] });
        }
      },
      removeFromCart: (plantId) => {
        set({
          cart: get().cart.filter((item) => item.id !== plantId),
        });
      },
      updateQuantity: (plantId, quantity) => {
        set({
          cart: get().cart.map((item) =>
            item.id === plantId ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      isCartOpen: false,
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
    }),
    {
      name: 'greenhaven-cart',
      partialize: (state) => ({ cart: state.cart }), // Only persist cart data, not UI state
    }
  )
);

export default useCartStore;
