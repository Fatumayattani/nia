/**
 * Hook for managing chat operations
 */
import { useCallback, useState } from 'react'
import { useAppStore } from '../store'
import { apiService } from '../services/api'
import { ChatMessage } from '../types'

export const useChat = (userId: string | null) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { chatHistory, addMessage, setChatHistory } = useAppStore()

  const loadHistory = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)
    try {
      const history = await apiService.getChatHistory(userId)
      setChatHistory(history)
    } catch (err) {
      setError((err as any).message || 'Failed to load chat history')
    } finally {
      setIsLoading(false)
    }
  }, [userId, setChatHistory])

  const sendMessage = useCallback(async (message: string) => {
    if (!userId) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Add user message
      addMessage({ role: 'user', content: message })
      
      // Get response
      const response = await apiService.sendMessage(userId, message)
      addMessage({ role: 'assistant', content: response.response })
      
      return response
    } catch (err) {
      setError((err as any).message || 'Failed to send message')
    } finally {
      setIsLoading(false)
    }
  }, [userId, addMessage])

  const sendVoiceMessage = useCallback(async (audioBase64: string) => {
    if (!userId) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiService.sendVoiceMessage(userId, audioBase64)
      addMessage({ role: 'assistant', content: response.response })
      return response
    } catch (err) {
      setError((err as any).message || 'Failed to process voice message')
    } finally {
      setIsLoading(false)
    }
  }, [userId, addMessage])

  return { chatHistory, sendMessage, sendVoiceMessage, loadHistory, isLoading, error }
}
