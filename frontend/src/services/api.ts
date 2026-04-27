/**
 * API service for backend communication
 */
import axios from 'axios'
import { User, ChatResponse, VoiceInput } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const apiService = {
  /**
   * User endpoints
   */
  async register(email: string, name: string, password: string): Promise<User> {
    const response = await api.post('/users/register', {
      email,
      name,
      password,
    })
    return response.data
  },

  async login(email: string, password: string): Promise<{ user_id: string; email: string; name: string }> {
    const response = await api.post('/users/login', {
      email,
      password,
    })
    return response.data
  },

  async getUser(userId: string): Promise<User> {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${userId}`, data)
    return response.data
  },

  /**
   * Chat endpoints
   */
  async sendMessage(userId: string, message: string): Promise<ChatResponse> {
    const response = await api.post('/chat/message', {
      user_id: userId,
      message,
    })
    return response.data
  },

  async sendVoiceMessage(userId: string, audioBase64: string, language: string = 'en'): Promise<ChatResponse> {
    const response = await api.post(`/chat/voice?user_id=${userId}`, {
      audio_base64: audioBase64,
      language,
    })
    return response.data
  },

  async getChatHistory(userId: string, limit: number = 50): Promise<any[]> {
    const response = await api.get(`/chat/history/${userId}`, {
      params: { limit },
    })
    return response.data
  },
}
