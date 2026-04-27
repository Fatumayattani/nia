/**
 * Type definitions for the Nia application
 */

export interface User {
  id: string;
  email: string;
  name: string;
  monthly_income?: number;
  monthly_expenses?: number;
  risk_tolerance?: 'low' | 'medium' | 'high';
  is_active: boolean;
  created_at: string;
}

export interface FinancialData {
  id: string;
  user_id: string;
  transaction_type: 'income' | 'expense' | 'investment';
  category: string;
  amount: number;
  description?: string;
  date: string;
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export interface FinancialAdvice {
  advice: string;
  category: string;
  confidence: number;
  sources: string[];
}

export interface ChatResponse {
  response: string;
  advice?: FinancialAdvice;
}

export interface VoiceInput {
  audio_base64: string;
  language: string;
}
