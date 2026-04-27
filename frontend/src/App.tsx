/**
 * Main App component
 */
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './components/LoginPage'
import { DashboardPage } from './components/DashboardPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAppStore } from './store'
import { apiService } from './services/api'
import './index.css'

function App() {
  const { setUser, setAuthenticated } = useAppStore()

  useEffect(() => {
    // Check if user is already logged in
    const userId = localStorage.getItem('userId')
    if (userId) {
      apiService.getUser(userId).then((user) => {
        setUser(user)
        setAuthenticated(true)
      }).catch(() => {
        localStorage.removeItem('userId')
      })
    }
  }, [setUser, setAuthenticated])

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App
