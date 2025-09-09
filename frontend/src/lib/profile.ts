import { api } from './api'
// Importamos o tipo 'User' para ser usado na interface do Perfil
import { User } from './auth'

export interface Profile {
  id: number
  user_id: number
  first_name: string | null
  last_name: string | null
  has_disability: boolean
  disability_details?: string | null
  experience_summary: string
  location: string
  created_at: string
  // =====================================================================
  // CORREÇÃO APLICADA AQUI:
  // Adicionamos a propriedade 'user' que é retornada pela API junto com o perfil.
  // =====================================================================
  user: User
}

// =====================================================================
// NOVO TIPO ADICIONADO ABAIXO:
// Define a estrutura para os dados de análise de currículo.
// =====================================================================
export interface CVAnalysis {
  strengths: string[]
  // CORREÇÃO: Renomeado para 'improvements' e adicionado os outros campos
  // que a página de análise espera.
  improvements: string[]
  suggested_skills: string[]
  accessibility_notes: string[]
  keyword_analysis: {
    matched: string[]
    missing: string[]
  }
  overall_feedback: string
}

export const profileService = {
  /**
   * Busca o perfil do usuário logado.
   */
  async getMyProfile(): Promise<Profile> {
    const response = await api.get('/api/v1/profile/me')
    return response.data
  },

  /**
   * Função genérica para buscar perfil (pode ser a mesma que getMyProfile neste caso).
   */
  async getProfile(): Promise<Profile> {
    // Para simplificar, estamos chamando o mesmo endpoint.
    // Isso poderia ser ajustado para buscar perfis de outros usuários se necessário.
    const response = await api.get('/api/v1/profile/me')
    return response.data
  },

  /**
   * Atualiza o perfil do usuário logado.
   */
  async updateProfile(profileData: Partial<Profile>): Promise<Profile> {
    const response = await api.put('/api/v1/profile/me', profileData)
    return response.data
  },

  // =====================================================================
  // NOVA FUNÇÃO ADICIONADA ABAIXO:
  // Busca a análise de currículo gerada pela IA para o usuário logado.
  // =====================================================================
  async getCVAnalysis(): Promise<CVAnalysis> {
    const response = await api.get('/api/v1/profile/cv-analysis')
    // A API original pode retornar 'areas_for_improvement', então mapeamos para 'improvements'
    const data = response.data
    return {
      ...data,
      improvements: data.areas_for_improvement || [],
    }
  },
}
