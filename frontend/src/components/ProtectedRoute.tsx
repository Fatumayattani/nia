/**
 * Protected route component
 */
import React from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const userId = localStorage.getItem('userId')
  
  if (!userId) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}
