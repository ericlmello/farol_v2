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
  // =====================================================================
  // CORREÇÃO APLICADA AQUI: 'isLoading' foi renomeado para 'loading'
  // para corresponder ao que é fornecido pelo AuthContext.
  // =====================================================================
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Não faça nada enquanto a autenticação está sendo verificada
    if (loading) {
      return
    }

    // Se não está autenticado, redireciona para o login
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Se o tipo de usuário não é permitido, redireciona para o dashboard
    if (user && !allowedUserTypes.includes(user.user_type)) {
      router.push('/dashboard') // ou para uma página de "acesso negado"
    }
  }, [isAuthenticated, loading, user, allowedUserTypes, router])

  // Exibe um estado de carregamento enquanto a verificação está em andamento
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Carregando...</div>
      </div>
    )
  }

  // Se o usuário está autenticado e tem o tipo correto, renderiza o conteúdo
  if (isAuthenticated && user && allowedUserTypes.includes(user.user_type)) {
    return <>{children}</>
  }

  // Caso contrário, não renderiza nada (pois o useEffect fará o redirecionamento)
  return null
}
