/**
 * Chat window component
 */
import React, { useEffect, useRef } from 'react'
import { ChatMessage as ChatMessageType } from '../types'

interface ChatWindowProps {
  messages: ChatMessageType[]
  isLoading?: boolean
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading = false }) => {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="chat-window flex flex-col h-full max-h-96 overflow-y-auto border rounded p-4 bg-gray-50">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Start a conversation with Nia...</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block max-w-xs px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-black'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))
      )}
      
      {isLoading && (
        <div className="text-center text-gray-500 text-sm">
          <p>Nia is thinking...</p>
        </div>
      )}
      
      <div ref={endRef} />
    </div>
  )
}
