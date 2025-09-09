'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui'

export function Navigation() {
  // =====================================================================
  // CORREÇÃO APLICADA AQUI: 'isLoading' foi renomeado para 'loading'
  // para corresponder ao que é fornecido pelo AuthContext.
  // =====================================================================
  const { user, loading, logout, isAuthenticated } = useAuth()

  // Durante o carregamento inicial para verificar a autenticação,
  // podemos mostrar um estado de "esqueleto" ou nulo.
  if (loading) {
    return (
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <span className="h-8 w-20 bg-gray-200 rounded animate-pulse"></span>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-4">
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    )
  }

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Farol IA
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Meu Perfil
                  </Link>
                  <Button onClick={logout} variant="outline" size="sm">
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Criar Conta</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
