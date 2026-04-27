/**
 * Voice input component
 */
import React, { useState } from 'react'
import { audioService } from '../services/audio'

interface VoiceInputProps {
  onVoiceInput: (audioBase64: string) => Promise<void>
  isLoading?: boolean
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput, isLoading = false }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStartRecording = async () => {
    try {
      setError(null)
      await audioService.startRecording()
      setIsRecording(true)
    } catch (err) {
      setError('Failed to start recording: ' + (err as Error).message)
    }
  }

  const handleStopRecording = async () => {
    try {
      setIsRecording(false)
      const audioBase64 = await audioService.stopRecording()
      await onVoiceInput(audioBase64)
    } catch (err) {
      setError('Failed to process audio: ' + (err as Error).message)
    }
  }

  return (
    <div className="voice-input">
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      
      {!isRecording ? (
        <button
          onClick={handleStartRecording}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          <span>🎤</span>
          Start Recording
        </button>
      ) : (
        <button
          onClick={handleStopRecording}
          disabled={isLoading}
          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 animate-pulse"
        >
          <span>⏹️</span>
          Stop Recording
        </button>
      )}
    </div>
  )
}
