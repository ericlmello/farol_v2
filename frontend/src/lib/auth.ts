// ARQUIVO: frontend/src/lib/auth.ts

import { api } from './api'
import { jwtDecode } from 'jwt-decode'

// Tipos para os dados de login e registro
export interface LoginData {
  username: string // O backend espera 'username' para o e-mail no login
  password: string
}

export interface RegisterData {
  email: string
  password: string
  user_type: 'candidate' | 'recruiter'
}

export interface User {
  id: number
  email: string
  user_type: 'candidate' | 'recruiter'
  is_active: boolean
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export const authService = {
  /**
   * Realiza o login do usuário.
   */
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

  /**
   * Realiza o cadastro de um novo usuário.
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/api/v1/auth/register', userData)
    return response.data
  },

  /**
   * Salva o token de autenticação no localStorage.
   */
  saveToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  },

  /**
   * Remove o token de autenticação do localStorage.
   */
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
    }
  },

  /**
   * Obtém o token de autenticação do localStorage.
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  },

  /**
   * Verifica se o usuário está autenticado (token existe e não está expirado).
   */
  isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) {
      return false
    }
    try {
      const decoded: { exp: number } = jwtDecode(token)
      // Verifica se o tempo de expiração do token é maior que o tempo atual
      return decoded.exp * 1000 > Date.now()
    } catch (error) {
      console.error('Token inválido:', error)
      return false
    }
  },

  /**
   * Busca os dados do usuário logado a partir do token.
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/api/v1/users/me')
    return response.data
  },
}

