/**
 * Audio service for voice input and processing
 */

export class AudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;

  /**
   * Start recording audio
   */
  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.mediaRecorder = new MediaRecorder(stream)
      this.audioChunks = []
      this.isRecording = true

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data)
      }

      this.mediaRecorder.start()
    } catch (error) {
      console.error('Error accessing microphone:', error)
      throw error
    }
  }

  /**
   * Stop recording audio and return as base64
   */
  async stopRecording(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('Recording not started'))
        return
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' })
        const reader = new FileReader()

        reader.onloadend = () => {
          const base64Audio = (reader.result as string).split(',')[1]
          resolve(base64Audio)
        }

        reader.onerror = () => {
          reject(new Error('Failed to read audio'))
        }

        reader.readAsDataURL(audioBlob)
      }

      this.mediaRecorder.stop()
      this.isRecording = false
    })
  }

  /**
   * Check if currently recording
   */
  getIsRecording(): boolean {
    return this.isRecording
  }

  /**
   * Convert audio file to base64
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
}

export const audioService = new AudioService()
