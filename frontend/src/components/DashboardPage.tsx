/**
 * Dashboard/Chat page component
 */
import React, { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useChat } from '../hooks/useChat'
import { ChatWindow } from './ChatWindow'
import { TextInput } from './TextInput'
import { VoiceInput } from './VoiceInput'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { user } = useAppStore()
  const userId = localStorage.getItem('userId')
  const { chatHistory, sendMessage, sendVoiceMessage, loadHistory, isLoading } = useChat(userId)

  useEffect(() => {
    if (!userId) {
      navigate('/login')
      return
    }
    loadHistory()
  }, [userId, navigate, loadHistory])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!userId) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Nia - Financial AI Agent</h1>
          <div className="flex items-center gap-4">
            {user && <span className="text-sm text-gray-600">{user.name}</span>}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Chat with Nia</h2>
              
              <ChatWindow messages={chatHistory} isLoading={isLoading} />
              
              <div className="mt-6 space-y-4">
                <TextInput onSend={sendMessage} isLoading={isLoading} />
                <VoiceInput onVoiceInput={sendVoiceMessage} isLoading={isLoading} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">Profile</h3>
              
              {user && (
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  
                  {user.monthly_income && (
                    <div>
                      <p className="text-gray-600">Monthly Income</p>
                      <p className="font-medium">${user.monthly_income}</p>
                    </div>
                  )}
                  
                  {user.monthly_expenses && (
                    <div>
                      <p className="text-gray-600">Monthly Expenses</p>
                      <p className="font-medium">${user.monthly_expenses}</p>
                    </div>
                  )}
                  
                  {user.risk_tolerance && (
                    <div>
                      <p className="text-gray-600">Risk Tolerance</p>
                      <p className="font-medium capitalize">{user.risk_tolerance}</p>
                    </div>
                  )}
                </div>
              )}
              
              <button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
