// ARQUIVO: frontend/src/lib/auth.ts

import { api } from './api'

// =====================================================================
// CORREÇÃO 1: Criamos e exportamos a interface 'User'
// =====================================================================
export interface User {
  id: number
  email: string
  user_type: 'candidate' | 'recruiter'
  is_active: boolean
}

// Tipos para os dados de login e registro
export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  user_type: 'candidate' | 'recruiter'
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User // Agora usamos a interface 'User' que acabamos de criar
}

export const authService = {
  async login(credentials: LoginData): Promise<AuthResponse> {
    const formData = new URLSearchParams()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)

    const response = await api.post('/api/v1/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/api/v1/auth/register', userData)
    return response.data
  },

  saveToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  },
}
