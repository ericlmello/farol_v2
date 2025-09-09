'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService, type RegisterData } from '@/lib/auth'
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, Select } from '@/components/ui'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  // =====================================================================
  // CORREÇÃO 1: Ajustado o tipo do estado para corresponder ao que a API espera.
  // =====================================================================
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'candidate' as 'candidate' | 'recruiter', // Tipo corrigido
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.')
      setLoading(false)
      return
    }

    try {
      await authService.register({
        email: formData.email,
        password: formData.password,
        user_type: formData.userType,
      })

      // Após cadastro bem-sucedido, redirecionar para login
      router.push('/login?status=registered')
    } catch (err: any) {
      console.error('Erro no cadastro:', err)
      const errorMessage = err.response?.data?.detail || 'Erro ao criar conta. Tente novamente.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Criar uma Conta</CardTitle>
          <CardDescription>
            Junte-se à nossa comunidade para encontrar as melhores oportunidades.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="userType">Tipo de conta</Label>
              <Select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                required
              >
                {/* ===================================================================== */}
                {/* CORREÇÃO 2: Alterado "company" para "recruiter" e removido "admin". */}
                {/* ===================================================================== */}
                <option value="candidate">Candidato</option>
                <option value="recruiter">Recrutador</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:underline">
              Faça login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
