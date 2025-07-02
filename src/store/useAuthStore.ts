import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isLoggedIn: boolean
  userId: string
  email: string
  password: string
  displayName: string
  token: string | null
  refreshToken: string | null
  expiresIn: string | null
  role: string | null

  setEmail: (email: string) => void
  setPassword: (password: string) => void

  setAuth: (data: {
    email: string
    userId: string
    password: string
    displayName: string
    token: string
    refreshToken: string
    expiresIn: string
    role: string
  }) => void

  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      email: '',
      userId: '',
      password: '',
      displayName: '',
      token: null,
      refreshToken: null,
      expiresIn: null,
      role: null,
      setEmail: (email) => set({ email }),
      setPassword: (password) => set({ password }),

      setAuth: ({ email, userId, password, displayName, token, refreshToken, expiresIn, role }) =>
        set({
          isLoggedIn: true,
          userId,
          email,
          password,
          displayName,
          token,
          refreshToken,
          expiresIn,
          role
        }),

      logout: () =>
        set({
          isLoggedIn: false,
          userId: '',
          email: '',
          role: null,
          password: '',
          displayName: '',
          token: null,
          refreshToken: null,
          expiresIn: null,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => key !== 'password')
        ),
    }
  )
)
