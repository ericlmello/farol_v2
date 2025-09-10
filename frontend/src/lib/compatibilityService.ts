import { Job } from './jobs'
import { Profile } from './profile'
import { CompatibilityCalculator, type CompatibilityScore, type JobWithCompatibility } from './compatibility'
import { User } from './auth'

// =====================================================================
// CORREÇÃO APLICADA AQUI: Adicionadas as propriedades 'bio', 'user' e
// outras opcionais para que o objeto corresponda à interface 'Profile'.
// =====================================================================
const DEFAULT_PYTHON_PROFILE: Profile = {
  id: 0,
  user_id: 0,
  first_name: 'Programador',
  last_name: 'Python',
  bio: 'Perfil padrão para cálculo de compatibilidade.',
  has_disability: false,
  disability_details: null,
  accessibility_needs: null,
  disability_type: null,
  disability_description: null,
  experience_summary: 'Desenvolvedor backend Python com 4 anos de experiência em Django, FastAPI, PostgreSQL, Redis, Docker, AWS. Conhecimento em testes automatizados, APIs REST, microserviços e CI/CD. Experiência com metodologias ágeis e trabalho remoto.',
  location: 'São Paulo, SP',
  created_at: new Date().toISOString(),
  user: {
    id: 0,
    email: 'default@example.com',
    user_type: 'candidate',
    is_active: true,
  }
}

export class CompatibilityService {
  private static instance: CompatibilityService
  private calculator: CompatibilityCalculator

  private constructor() {
    this.calculator = new CompatibilityCalculator(DEFAULT_PYTHON_PROFILE)
  }

  public static getInstance(): CompatibilityService {
    if (!CompatibilityService.instance) {
      CompatibilityService.instance = new CompatibilityService()
    }
    return CompatibilityService.instance
  }

  public calculateMultipleJobsCompatibility(jobs: Job[]): JobWithCompatibility[] {
    return this.calculator.calculateMultipleJobs(jobs)
  }

  public sortJobsByCompatibility(jobs: JobWithCompatibility[]): JobWithCompatibility[] {
    return this.calculator.sortByCompatibility(jobs)
  }

  public filterJobsByCompatibility(jobs: JobWithCompatibility[], minScore: number): JobWithCompatibility[] {
    return jobs.filter(job => (job.compatibility?.score || 0) >= minScore)
  }

  public updateUserProfile(profile: Profile | null): void {
    this.calculator = new CompatibilityCalculator(profile || DEFAULT_PYTHON_PROFILE)
  }
}

// Instância singleton
export const compatibilityService = CompatibilityService.getInstance()
