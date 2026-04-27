/**
 * Zustand store for application state
 */
import { create } from 'zustand'
import { User, ChatMessage } from '../types'

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  chatHistory: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  
  setUser: (user: User | null) => void;
  setAuthenticated: (auth: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  setChatHistory: (history: ChatMessage[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  chatHistory: [],
  isLoading: false,
  error: null,
  
  setUser: (user) => set({ user }),
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  addMessage: (message) => set((state) => ({
    chatHistory: [...state.chatHistory, message]
  })),
  setChatHistory: (history) => set({ chatHistory: history }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  logout: () => set({
    user: null,
    isAuthenticated: false,
    chatHistory: [],
    error: null
  })
}))
