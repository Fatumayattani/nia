/**
 * Hook for managing authentication
 */
import { useState, useCallback } from 'react'
import { useAppStore } from '../store'
import { apiService } from '../services/api'

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { setUser, setAuthenticated, logout: logoutStore } = useAppStore()

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiService.login(email, password)
      const user = await apiService.getUser(response.user_id)
      setUser(user)
      setAuthenticated(true)
      localStorage.setItem('userId', response.user_id)
      return true
    } catch (err) {
      setError((err as any).message || 'Login failed')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [setUser, setAuthenticated])

  const register = useCallback(async (email: string, name: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const user = await apiService.register(email, name, password)
      setUser(user)
      setAuthenticated(true)
      localStorage.setItem('userId', user.id)
      return true
    } catch (err) {
      setError((err as any).message || 'Registration failed')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [setUser, setAuthenticated])

  const logout = useCallback(() => {
    localStorage.removeItem('userId')
    logoutStore()
  }, [logoutStore])

  return { login, register, logout, isLoading, error }
}
