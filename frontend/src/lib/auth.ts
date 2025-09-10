import { api } from './api'
import { jwtDecode } from 'jwt-decode'

export interface User {
  id: number
  email: string
  user_type: 'candidate' | 'recruiter'
  is_active: boolean
}

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
  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  },

  // =====================================================================
  // CORREÇÃO: Adicionado um "alias" para consistência com o AuthContext.
  // Agora, tanto setToken quanto saveToken funcionarão.
  // =====================================================================
  saveToken(token: string) {
    this.setToken(token)
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
   * Verifica se existe um token válido e não expirado.
   */
  isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) {
      return false
    }

    try {
      const decoded: { exp: number } = jwtDecode(token)
      // Verifica se o token expirou
      if (decoded.exp * 1000 < Date.now()) {
        this.logout() // Limpa o token expirado
        return false
      }
      return true
    } catch (error) {
      console.error('Token inválido:', error)
      return false
    }
  },

  /**
   * Busca os dados do usuário atual a partir do token.
   * (Esta função pode ser expandida ou usar um endpoint /me da API)
   */
  async getCurrentUser(): Promise<User | null> {
    if (!this.isAuthenticated()) {
      return null
    }
    // A lógica para buscar o usuário pode ser mais complexa,
    // como chamar um endpoint /api/v1/users/me
    // Por enquanto, podemos decodificar o token para obter informações básicas
    const token = this.getToken()
    if (token) {
        try {
            // A sua API deve incluir os dados do usuário no token para isto funcionar
            const decoded: { user: User } = jwtDecode(token) 
            return decoded.user
        } catch (e) {
            return null
        }
    }
    return null
  }
}
