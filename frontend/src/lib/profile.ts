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
  user: User
}

// =====================================================================
// NOVO TIPO ADICIONADO ABAIXO:
// Define a estrutura para os dados de atualização do perfil.
// =====================================================================
export interface ProfileUpdate {
  first_name?: string | null
  last_name?: string | null
  has_disability?: boolean
  disability_details?: string | null
  experience_summary?: string
  location?: string
}

export interface CVAnalysis {
  strengths: string[]
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
    const response = await api.get('/api/v1/profile/me')
    return response.data
  },

  /**
   * Atualiza o perfil do usuário logado.
   */
  async updateProfile(profileData: ProfileUpdate): Promise<Profile> {
    const response = await api.put('/api/v1/profile/me', profileData)
    return response.data
  },

  /**
   * Busca a análise de currículo gerada pela IA para o usuário logado.
   */
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
