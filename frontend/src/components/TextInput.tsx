/**
 * Text input component
 */
import React, { useState } from 'react'

interface TextInputProps {
  onSend: (message: string) => Promise<void>
  isLoading?: boolean
}

export const TextInput: React.FC<TextInputProps> = ({ onSend, isLoading = false }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return
    
    await onSend(message)
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask Nia anything about your finances..."
        disabled={isLoading}
        className="flex-1 px-4 py-2 border rounded disabled:bg-gray-100"
      />
      <button
        type="submit"
        disabled={isLoading || !message.trim()}
        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
      >
        Send
      </button>
    </form>
  )
}
