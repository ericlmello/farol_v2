'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authService, User } from '@/lib/auth'
import { profileService } from '@/lib/profile'
import { jwtDecode } from 'jwt-decode'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: any) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const initializeAuth = useCallback(async () => {
    const token = authService.getToken()
    if (token) {
      try {
        const decoded: { sub: string; exp: number } = jwtDecode(token)
        if (decoded.exp * 1000 < Date.now()) {
          authService.logout()
          setUser(null)
        } else {
          // Buscar o perfil para obter os dados completos do usuário
          const userProfile = await profileService.getMyProfile()
          setUser(userProfile.user)
        }
      } catch (error) {
        console.error('Falha ao inicializar autenticação:', error)
        authService.logout()
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  const login = async (credentials: any) => {
    const data = await authService.login(credentials)
    authService.saveToken(data.access_token)
    setUser(data.user)
    router.push('/dashboard')
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook principal para acessar todo o contexto
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

// =====================================================================
// NOVOS HOOKS ADICIONADOS ABAIXO
// =====================================================================

/**
 * Hook de atalho para obter o tipo do usuário logado.
 */
export const useUserType = () => {
  const { user } = useAuth()
  return user?.user_type
}

/**
 * Hook de atalho para verificar se o usuário está ativo.
 */
export const useIsActive = () => {
  const { user } = useAuth()
  return user?.is_active
}
