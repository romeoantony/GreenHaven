import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => {
        if (token) {
          try {
            const decoded = jwtDecode(token);
            const user = {
              email: decoded.email,
              id: decoded.sub, // sub is now the ID
              fullName: decoded.FullName,
              roles: decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || []
            };
            set({ token, user });
          } catch (error) {
            console.error("Invalid token", error);
            set({ token: null, user: null });
          }
        } else {
          set({ token: null, user: null });
        }
      },
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'greenhaven-auth',
    }
  )
);

export default useAuthStore;
