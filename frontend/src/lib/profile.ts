import { api } from './api'
import { User } from './auth'

// =======================================================
// CORREÇÃO: Adicionados TODOS os campos que faltavam
// =======================================================
export interface Profile {
  id: number
  user_id: number
  first_name: string | null
  last_name: string | null
  bio: string | null
  has_disability: boolean
  disability_details?: string | null
  accessibility_needs?: string | null
  disability_type?: string | null
  disability_description?: string | null
  experience_summary: string
  location: string
  created_at: string
  user: User
}

export interface ProfileUpdate {
  first_name?: string
  last_name?: string
  bio?: string
  location?: string
  has_disability?: boolean
  accessibility_needs?: string
  disability_type?: string
  disability_description?: string
  experience_summary?: string
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

export interface UploadCVResponse {
  message: string
  analysis: CVAnalysis
  extracted_text: string
}

export const profileService = {
  async getMyProfile(): Promise<Profile> {
    const response = await api.get('/api/v1/profile/me')
    return response.data
  },

  async getProfile(): Promise<Profile> {
    const response = await api.get('/api/v1/profile/me')
    return response.data
  },

  async updateMyProfile(profileData: ProfileUpdate): Promise<Profile> {
    const response = await api.put('/api/v1/profile/me', profileData)
    return response.data
  },

  async getCVAnalysis(): Promise<CVAnalysis> {
    const response = await api.get('/api/v1/profile/cv-analysis')
    const data = response.data
    return {
      ...data,
      improvements: data.areas_for_improvement || [],
    }
  },

  async uploadCV(file: File): Promise<UploadCVResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/api/v1/profile/upload-cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}

