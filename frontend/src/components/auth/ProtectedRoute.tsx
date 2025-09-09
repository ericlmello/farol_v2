'use client'

import React, { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  allowedUserTypes: Array<'candidate' | 'recruiter'>
}

export function ProtectedRoute({
  children,
  allowedUserTypes,
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Don't do anything while auth state is loading
    if (loading) {
      return
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // If user type is not allowed, redirect to dashboard
    if (user && !allowedUserTypes.includes(user.user_type)) {
      router.push('/dashboard') // or to an "access denied" page
    }
  }, [isAuthenticated, loading, user, allowedUserTypes, router])

  // Show a loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Carregando...</div>
      </div>
    )
  }

  // If authenticated and user type is correct, render the content
  if (isAuthenticated && user && allowedUserTypes.includes(user.user_type)) {
    return <>{children}</>
  }

  // Otherwise, render null while the redirect happens
  return null
}

// =====================================================================
// NOVO COMPONENTE ADICIONADO ABAIXO
// Este componente protege rotas que são apenas para usuários deslogados (ex: login, register)
// =====================================================================
export function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Se a autenticação já foi verificada e o usuário ESTÁ logado,
    // redireciona para o dashboard.
    if (!loading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, loading, router])

  // Enquanto carrega ou se o usuário não está autenticado,
  // exibe a página (ex: a página de login).
  if (loading || !isAuthenticated) {
    return <>{children}</>
  }

  // Se o usuário está autenticado, não renderiza nada
  // pois o redirecionamento já foi iniciado.
  return null
}

// =====================================================================
// NOVO HOOK ADICIONADO ABAIXO
// Este hook verifica se o usuário atual tem permissão para acessar um recurso.
// =====================================================================
export function useCanAccess(allowedUserTypes: Array<'candidate' | 'recruiter'>): boolean {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user) {
    return false
  }

  return allowedUserTypes.includes(user.user_type)
}
